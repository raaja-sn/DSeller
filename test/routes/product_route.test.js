const request = require('supertest')
const app = require('../../src/app')
const productfixture = require('./fixtures/productroutefixture')

beforeAll(async()=>{
    await productfixture.setUpDatabase()
})

test('Create a new product',async()=>{
    const resp = await request(app).post('/product').send({
        name:'Samsung Galaxy S23',
        category:'Electronics',
        subCategory:'Mobiles',
        descriptionLong:'The all new Samsung Galaxy S22 with new generation Snapdragon processor and 12 GB of RAM',
        price:65000
    }).expect(201)
    productfixture.testProductId = resp.body._id
    expect(resp.body.name).toEqual('Samsung Galaxy S23')
})

test('Creating a product without name should send error response',async()=>{
    const resp = await request(app).post('/product').send({
        name:undefined,
        category:'Electronics',
        subCategory:'Mobiles',
        descriptionLong:'The all new Samsung Galaxy S22 with new generation Snapdragon processor and 12 GB of RAM',
        price:65000
    }).expect(400)
    expect(resp.body.message).toEqual('Product name cannot be empty')
})

test('Creating a product without category should send error response',async()=>{
    const resp = await request(app).post('/product').send({
        name:'Samsugn Galaxy S23',
        category:'',
        subCategory:'Mobiles',
        descriptionLong:'The all new Samsung Galaxy S22 with new generation Snapdragon processor and 12 GB of RAM',
        price:65000
    }).expect(400)
    expect(resp.body.message).toEqual('Category cannot be empty')
})

test('Creating a product without sub category should send error response',async()=>{
    const resp = await request(app).post('/product').send({
        name:'Samsugn Galaxy S23',
        category:'Electronics',
        subCategory:'',
        descriptionLong:'The all new Samsung Galaxy S22 with new generation Snapdragon processor and 12 GB of RAM',
        price:65000
    }).expect(400)
    expect(resp.body.message).toEqual('Sub Category cannot be empty')
})

test('Creating a product without long description should send error response',async()=>{
    const resp = await request(app).post('/product').send({
        name:'Samsugn Galaxy S23',
        category:'Electronics',
        subCategory:'Mobile',
        descriptionLong:undefined,
        price:65000
    }).expect(400)
    expect(resp.body.message).toEqual('Enter a valid product description')
})

test('Creating a product without price should send error response',async()=>{
    const resp = await request(app).post('/product').send({
        name:'Samsugn Galaxy S23',
        category:'Electronics',
        subCategory:'Mobile',
        descriptionLong:'The all new Samsung Galaxy S22 with new generation Snapdragon processor and 12 GB of RAM',
        price:undefined
    }).expect(400)
    expect(resp.body.message).toEqual('Enter a valid product cost')
})

test('Get an existing product',async()=>{
    const resp = await request(app).get(`/product/${productfixture.testProductId}`)
    .expect(200)
    expect(resp.body.name).toEqual('Samsung Galaxy S23')
})

test('Getting a product with invalid product id should send error response',async()=>{
    const resp = await request(app).get(`/product/hfghgh`)
    .expect(400)
    expect(resp.body.message).toEqual('Product Id is invalid')
})

test('Update an existing product',async()=>{
    const resp = await request(app).post('/product').send({
        name:'Indian Terrain Tshirt',
        category:'Clothing',
        subCategory:'Mens clothing',
        descriptionLong:'Super cool cotton blue T shirt for summers',
        price:1385
    }).expect(201)
    const uResp = await request(app).patch(`/product/${resp.body._id}`).send({
        descriptionLong:'Price dropped - Cool Blue T shirt suitable for summers',
        price:900
    }).expect(200)
    expect(uResp.body.descriptionLong).toBe('Price dropped - Cool Blue T shirt suitable for summers')
})

test('Updating an existing product with invalid product id should send error response',async()=>{
    const uResp = await request(app).patch(`/product/`).send({
        descriptionLong:'Price dropped - Cool Blue T shirt suitable for summers',
        price:900
    }).expect(400)
    expect(uResp.body.message).toBe('Product Id is invalid')
})

test('Delete an existing product',async()=>{
    const uResp = await request(app).post('/product').send({
        name:'Product to be deleted',
        category:'Cat',
        subCategory:'Sub Cat',
        descriptionLong:'An amazing is about to be deleted',
        price:23
    }).expect(201)
    const resp = await request(app).delete(`/product/${uResp.body._id}`).expect(200)
    expect(resp.body.isDeleted).toBe(true)
})

test('Deleting a product with invalid id should send error response',async()=>{
    const resp = await request(app).delete(`/product/`).expect(400)
    console.log(resp.body)
    expect(resp.body.message).toEqual('Product Id is invalid')
})

test('List products according to the search filters',async()=>{
    const resp = await request(app).get('/listproducts').query({
        subCategory:'bil',
        pageNumber:3,
        pageSize:5,
        sortBy:'name',
    }).expect(200)
    console.log(resp.body)
    expect(resp.body[2].name).not.toEqual(null)
})

