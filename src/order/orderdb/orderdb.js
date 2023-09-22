const mongoose = require('mongoose')
const Order = require('./order')
const User = require('../../user/userdb/user')
const Product = require('../../product/productdb/product')
const dbUtils = require('../../db/dbutils/dbUtils')

const getInvalidObjectIdException = (model)=>{
    return {
        name: dbUtils.customErrorTag,
        message: `${model} Id is invalid`
    }
}

/**
 * Fetch a Customer related to the order utilizing the mongo db sessions for transaction
 * @param {String} userId Id of the customer placing the order
 * @param {*} session Mongo DB Session relating to the transaction
 * @returns The user object for the giver userId
 */
const getCustomer = async(userId, session)=>{
    return await new User().findAUserWithSession(userId,session)
}

/**
 * Get a string Invoice number for the order
 * @param {any} user An Object with the Invoice no filed pupulated following the User Schema
 * @returns The invoice number for the order
 */
const getInvoiceNumber = (user)=>{
    const invoiceNo = `0000000`.concat(user.invoiceNo)
    return 'DSL'+invoiceNo.slice(invoiceNo.length-7,invoiceNo.length)
}

/**
 * Increment the Customer's invoice number field utilizing the mongo db sessions for transaction
 * @param {any} user An object following the same schema as User Schema, with inovice number and _id of the user to update
 * @param {*} session Mongo DB session relating to the transaction
 * @returns 
 */
const incrementInvoiceNumber = async(user,session)=>{
    return await User.updateOne({_id:user._id},{
        $inc:{
            'invoiceNo':1
        }
    }).session(session)
}

const updateProductStocks = async(products,session)=>{
    const cost = {}
    let billValue = 0
    let shippingCost = 0
    for(let p of products){
        const originalProduct = await Product.findById(p.productId).session(session)
        if(!originalProduct){
            throw({
                name: dbUtils.customErrorTag,
                message: `${p.name} is not found in the inventory`
            })
        }
        const updatedStock = (originalProduct.stock - p.quantity)
        if(updatedStock<0)throw({
            name: dbUtils.customErrorTag,
            message: `${originalProduct.name} is less in stock. Available quantity is ${originalProduct.stock }`
        })
        await Product.updateOne({_id:originalProduct._id},{stock:updatedStock}).session(session)
        billValue += (originalProduct.price * p.quantity)
        shippingCost += originalProduct.shippingCost
    }
    cost.billValue = billValue
    if(products.length > 0){
        cost.shippingCost = (shippingCost/products.length)
    }
    return cost
}

/**
 * Create a new order for a customer
 * @param {any} newOrder An object follwing the same schema as the Order Schema, to create a new Order
 * @returns The created order
 */
const createNewOrder = async(newOrder)=>{
    let session
    try {
        if(!mongoose.isValidObjectId(newOrder.userId)){
            throw(getInvalidObjectIdException('User'))
        }
        session = await mongoose.startSession()
        session.startTransaction()
        
        const user = await getCustomer(newOrder.userId, session)
        newOrder.invoiceNo = getInvoiceNumber(user)
        const cost = await updateProductStocks(newOrder.products,session)
        newOrder.billValue = cost.billValue
        newOrder.shippingCost = cost.shippingCost
        const order = await Order.create([newOrder], {session: session})
        await incrementInvoiceNumber(user)

        await session.commitTransaction()
        await session.endSession()
        return order
    }catch(e){
        throw(dbUtils.getErrorMessage(e,'Order'))
    }
}

/**
 * Find an order from the order Id
 * @param {String} orderId The order Id of the order to be fetched
 * @returns The Order associated with the order Id
 */
const findOrder = async(orderId)=>{
    try{
        if(!mongoose.isValidObjectId(orderId)){
            throw(getInvalidObjectIdException('Order'))
        }
        return await new Order().findAnOrder(orderId)
    }catch(e){
        throw(dbUtils.getErrorMessage(e,'Order'))
    }
}

/**
 * Get a list of orders matching the filter
 * @param {any} filter Filter to match the orders
 * @param {*} pageNumber Page number to fetch set of records matching the filter
 * @param {*} pagesize Number of records to return per page
 * @returns List of orders
 */
const listOrders = async(filter,pageNumber,pagesize)=>{
    try{
        if(pageNumber<0) return []
        if(pagesize < 1 || pagesize >100) return []
        return await new Order().listOrders(filter,pageNumber,pagesize)
    }catch(e){
        console.log(e)
        throw(dbUtils.getErrorMessage(e,'Order'))
    }
}

module.exports = {
    createNewOrder,
    findOrder,
    listOrders
}

