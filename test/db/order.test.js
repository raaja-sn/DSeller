const { default: mongoose } = require('mongoose')
const dbclient = require('../../src/db/dbclient')
const dbfixtures = require('../fixtures/dbfixture')

beforeAll(async()=>{
    await dbfixtures.orders.setupDatabase()
    const user = await dbfixtures.orders.getUser()
    const product = await dbfixtures.orders.getProduct()
    dbfixtures.orders.testOrder = dbfixtures.orders.getTestOrder(product,user)
})


test('Create a new Order',async()=>{
    const newOrder = JSON.parse(JSON.stringify(dbfixtures.orders.testOrder))
    const order = await dbclient.orderdb.createNewOrder(newOrder)
    expect(order[0]._id).not.toEqual(null)
})

test('Creating an order without products should throw error',async()=>{
    try{
        const order = JSON.parse(JSON.stringify(dbfixtures.orders.testOrder))
        order.products = []
        await dbclient.orderdb.createNewOrder(order)
    }catch(e){
        expect(e.message).toEqual('Atleast one product should be added to the cart to place the order')
    }
}) 

test('Creating an order without user Id should throw error',async()=>{
    try{
        const order = JSON.parse(JSON.stringify(dbfixtures.orders.testOrder))
        delete order.userId
        await dbclient.orderdb.createNewOrder(order)
    }catch(e){
        expect(e.message).toEqual('User Id is invalid')
    }
}) 

/*test('Creating an order without bill value should throw error',async()=>{
    try{
        const order = JSON.parse(JSON.stringify(dbfixtures.orders.testOrder))
        delete order.billValue
        await dbclient.orderdb.createNewOrder(order)
    }catch(e){
        expect(e.message).toEqual('Bill value cannot be empty')
    }
}) 

test('Creating an order without a valid product Id should throw error',async()=>{
    try{
        const order = JSON.parse(JSON.stringify(dbfixtures.orders.testOrder))
        order.products[0].productId = '650a8415f04f1faf0d5b9ef0'
        await dbclient.orderdb.createNewOrder(order)
    }catch(e){
        expect(e.message).toEqual('undefined is not found in the inventory')
    }
}) */

test('should get an order',async()=>{
    const order = JSON.parse(JSON.stringify(dbfixtures.orders.testOrder))
    order.products.pop()
    order.products[1].productName= 'Not an Nvidia card'
    const oldOrder = await dbclient.orderdb.createNewOrder(order)
    const newOrder = await dbclient.orderdb.findOrder(oldOrder[0]._id)
    expect(newOrder.products[1].productName).toEqual('Not an Nvidia card')
    expect(newOrder.products.length).toBe(2)
})

test('list orders matching the filter',async()=>{
    const orders = await dbclient.orderdb.listOrders({billValue:{$gt:40}},1,10)
    console.log(orders)
})