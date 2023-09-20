const Order = require('../../src/db/orderdb/order')
const Product = require('../../src/db/productdb/product')
const User = require('../../src/db/userdb/user')
const dbclient = require('../../src/db/dbclient')

const getTestProducts = (pId)=>{
    return {
        products: [
            {
                productName: 'Indian Terrain T-shirt',
                productId:pId,
                quantity:2,
                price:1345
            },
            {
                productName: 'Ferroro Rocher Chocolates',
                productId:pId,
                quantity:5,
                price:90
            },
            {
                productName: 'Samsung S22 20W Charger',
                productId:pId,
                quantity:1,
                price:2560.50
            }
        ]
    }
}

const getBillValue = (products)=>{
    let billValue = 0
    for(let p of products){
        billValue += p.price
    }
    return billValue
}

var testOrder
const getTestOrder = (product,user)=>{
    const p = getTestProducts(product._id)
    return {
        userId:user._id,
        products:p.products,
        billValue:getBillValue(p.products),
        shippingCost:400
    }
}

const getUser = async()=>{
    return await new User({
        fullname:'Raaja SN',
        email:'raaja@gmail.com',
        phoneNumber:4595585551,
        invoiceNo:901
    }).save()
}

const getProduct = async()=>{
    return await new Product({
        name:'Nvidia 4090 Ti ',
        category: 'Electronics',
        subCategory: 'Graphics Card',
        stock:36,
        price:160000,
        shippingCost:400,
        descriptionLong: "The latest of the Nvidia series of graphics cards with RTX and 30X the RTX coures than previous generation"
    }).save()
}

const getListProduct = async()=>{
    return await new Product({
        name:'Nvidia 4090 Ti ',
        category: 'Electronics',
        subCategory: 'Graphics Card',
        stock:980,
        price:160000,
        shippingCost:400,
        descriptionLong: "The latest of the Nvidia series of graphics cards with RTX and 30X the RTX coures than previous generation"
    }).save()
}

const getMockOrder = (i,user,product)=>{
    const p = getTestProducts(product._id)
    return {
        userId:user._id,
        products:p.products,
        billValue:i,
        shippingCost:400
    }
}

const setupDatabase = async()=>{
    await Order.deleteMany({})
    const user = await getUser()
    const product = await getListProduct()
    for(let i =1; i<=100; i++){
        await dbclient.orderdb.createNewOrder(getMockOrder(i,user,product))
    }
}

module.exports = {
    getUser,
    getProduct,
    testOrder,
    getTestOrder,
    setupDatabase
}