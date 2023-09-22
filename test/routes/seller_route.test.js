const request = require('supertest')
const app = require('../../src/app')
const sellerfixture = require('./fixtures/sellerroutefixture')

beforeAll(async()=>{
    await sellerfixture.setUpDatabase()
},30000)

test('Create a new seller',async()=>{
    const resp = await request(app).post('/seller').query({
        fullname:'Seller Test',
        email:'test@gmail.com',
        phoneNumber:8874568525
    }).expect(201)
    sellerfixture.testSellerId = resp.body._id
    expect(resp.body._id).not.toEqual(null)
})

test('Creating a seller without name should send error response',async()=>{
    const resp = await request(app).post('/seller').query({
        fullname:'',
        email:'test@gmail.com',
        phoneNumber:8874568525
    }).expect(400)
    expect(resp.body.message).toEqual('Name cannot be empty')
})

test('Creating a seller without email should send error response',async()=>{
    const resp = await request(app).post('/seller').query({
        fullname:'Test User',
        email:'',
        phoneNumber:8874568525
    }).expect(400)
    expect(resp.body.message).toEqual('Email cannot be empty')
})

test('Creating a seller with invalid email should send error response',async()=>{
    const resp = await request(app).post('/seller').query({
        fullname:'Test User',
        email:'test.com',
        phoneNumber:8874568525
    }).expect(400)
    expect(resp.body.message).toEqual('Enter a valid Email address')
})

test('Creating a seller without phone number should send error response',async()=>{
    const resp = await request(app).post('/seller').query({
        fullname:'Test User',
        email:'test@gmail.com',
        phoneNumber:undefined
    }).expect(400)
    expect(resp.body.message).toEqual('Phone number cannot be empty')
})

test('Creating a seller with invalid phone number should send error response',async()=>{
    const resp = await request(app).post('/seller').query({
        fullname:'Test User',
        email:'test@gmail.com',
        phoneNumber:8
    }).expect(400)
    expect(resp.body.message).toEqual('Invalid mobile number')
})

test('Get an exsiting seller',async()=>{
    const uResp = await request(app).post('/seller').query({
        fullname:'Raaja Seller',
        email:'test@gmail.com',
        phoneNumber:8874568525
    }).expect(201)

    const resp = await request(app).get(`/seller/${uResp.body._id}`).expect(200)
    expect(resp.body.fullname).toEqual('Raaja Seller')
})

test('Getting a seller with invalid id should send error response',async()=>{
    const resp = await request(app).get(`/seller/sdfsdfsdf`).expect(400)
    expect(resp.body.message).toEqual('Invalid seller Id')
})

test('Getting a seller with deleted seller ID should send error response',async()=>{
    const resp = await request(app).get(`/seller/650c5b44d00b417d3850da1f`).expect(400)
    expect(resp.body.message).toEqual('Seller not found')
})

test('Update an existing seller',async()=>{
    const resp = await request(app).patch(`/seller/${sellerfixture.testSellerId}`)
    .query({
        fullname:'Brand New Seller'
    }).expect(200)
    expect(resp.body.fullname).toEqual('Brand New Seller')
})

test('Updating a seller with invalid id sends error response',async()=>{
    const resp = await request(app).patch('/seller/')
    .query({
        fullname:'Brand Second'
    }).expect(400)
    expect(resp.body.message).toEqual('Invalid seller Id')
})

test('Updating a seller with invalid email Id sends error response',async()=>{
    const resp = await request(app).patch(`/seller/${sellerfixture.testSellerId}`)
    .query({
        fullname:'Brand Second',
        email:'test'
    }).expect(400)
    expect(resp.body.message).toEqual('Enter a valid Email address')
})


test('Should list the sellers matching the search and sort filters',async()=>{
    const resp = await request(app).get('/listsellers').query({
        fullname:'oliver',
        pageNumber:2,
        pageSize:5,
        sortBy:'fullname',
    }).expect(200)
    console.log(resp.body)
})

