const request = require('supertest')
const app = require('../../src/app')
const orderfixture = require('./fixtures/orderroutefixture')

beforeAll(async()=>{
    orderfixture.testUsersList = await orderfixture.getListUsers()
    await orderfixture.setUpDatabase(orderfixture.testUsersList)
})

test('Create a new Order',async()=>{
    const order = await orderfixture.getTestOrder()
    const resp = await request(app).post('/order').send(order)
    .expect(201)
    orderfixture.testOrderId = resp.body._id
    expect(resp.body._id).not.toEqual(null)
})

test('Creating a new order without user Id should send error response',async()=>{
    const order = await orderfixture.getTestOrder()
    delete order.userId
    const resp = await request(app).post('/order').send(order)
    .expect(400)
    expect(resp.body.message).toEqual('User Id is invalid')
})

test('Creating a new order without products should send error response',async()=>{
    const order = await orderfixture.getTestOrder()
    delete order.products
    const resp = await request(app).post('/order').send(order)
    .expect(400)
    expect(resp.body.message).toEqual('Atleast one product should be added to the cart to place the order')
})

test('Creating a new order with invalid product should send error response',async()=>{
    const order = await orderfixture.getTestOrder()
    order.products[0].productId = '64f9de0f0b8bca88007dd793'
    const resp = await request(app).post('/order').send(order)
    .expect(400)
    expect(resp.body.message).toEqual('Product is not found in the inventory')
})

test('Get an existing order',async()=>{
    const resp = await request(app).get(`/order/${orderfixture.testOrderId}`)
    .expect(200)
    expect(resp.body.products[0].productName).toEqual('Indian Terrain T-shirt')
})

test('Getting an order with invalid id should send error response',async()=>{
    const resp = await request(app).get(`/order/`)
    .expect(400)
    expect(resp.body.message).toEqual('Order Id is invalid')
})

test('List the sellers matching the filter',async()=>{
    const resp = await request(app).get(`/listorders/${orderfixture.testUsersList[1]._id.toString()}`).query({
        pageNumber:3,
        pageSize:7
    })    
    console.log(resp.body)
    /expect(resp.body[0].userId).not.toEqual(null)
})

test('listing a seller with invalid user id should send empty list',async()=>{
    const resp = await request(app).get(`/listorders/`).query({
        pageNumber:3,
        pageSize:7
    })    
    console.log(resp.body)
    expect(resp.body.length).toBe(0)
})


