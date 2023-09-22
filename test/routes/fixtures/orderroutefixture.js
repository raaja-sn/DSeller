const Order = require('../../../src/order/orderdb/order')
const orderdb = require('../../../src/order/orderdb/orderdb')
const Product = require('../../../src/product/productdb/product')
const User = require('../../../src/user/userdb/user')
const dbclient = require('../../../src/db/dbclient')

let testOrderId
let testUsersList

const setUpDatabase = async(users)=>{
    await Order.deleteMany({})
    await Product.deleteMany({})
    const listProduct = await getListProduct()
    await saveListOrder(listProduct,users)
}

const getTestProducts = (pId)=>{
    return {
        products: [
            {
                productName: 'Indian Terrain T-shirt',
                productId:pId,
                quantity:2,
            },
            {
                productName: 'Ferroro Rocher Chocolates',
                productId:pId,
                quantity:5,
            },
            {
                productName: 'Samsung S22 20W Charger',
                productId:pId,
                quantity:1,
            }
        ]
    }
}

const getTestOrder = async()=>{
    const user = await getUser()
    const product = await getProduct()
    const p = getTestProducts(product._id)
    return {
        userId:user._id,
        products:p.products
    }
}

const getProduct = async()=>{
    return await new Product({
        name:'Nvidia 4090 Ti ',
        category: 'Electronics',
        subCategory: 'Graphics Card',
        stock:80,
        price:100,
        shippingCost:400,
        descriptionLong: "The latest of the Nvidia series of graphics cards with RTX and 30X the RTX coures than previous generation"
    }).save()
}

const getUser = async()=>{
    return await new User({
        fullname:'Raaja SN',
        email:'raaja@gmail.com',
        phoneNumber:4595585551,
        invoiceNo:901
    }).save()
}

const getListUsers = async()=>{
    const users = [
        {
            fullname:'Raaja SN',
            email:'raaja@gmail.com',
            phoneNumber:4595581236,
            invoiceNo:901
        },
        {
            fullname:'Mark Test',
            email:'mark@gmail.com',
            phoneNumber:4579588945,
            invoiceNo:901
        },
        {
            fullname:'Jane Test',
            email:'jane@gmail.com',
            phoneNumber:4595133658,
            invoiceNo:901
        }
    ]

    for(let i=0; i<3; i++){
        users[i] = await new User(users[i]).save()
    }

    return users
}

const getListProduct = async()=>{
    return await new Product({
        name:'Nvidia 4090 Ti ',
        category: 'Electronics',
        subCategory: 'Graphics Card',
        stock:900,
        price:100,
        shippingCost:400,
        descriptionLong: "The latest of the Nvidia series of graphics cards with RTX and 30X the RTX coures than previous generation"
    }).save()
}

const saveListOrder = async(product,users)=>{
    const p = getTestProducts(product._id)
    for(let i=0; i<100; i++){
        await orderdb.createNewOrder({
            userId:users[(Math.floor(Math.random() * users.length))]._id,
            products:p.products
        })
    }
}

module.exports = {
    setUpDatabase,
    getTestOrder,
    getListUsers,
    testOrderId,
    testUsersList
}