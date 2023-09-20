const request = require('supertest')
const app = require('../../src/app')
const userfixture = require('./fixtures/userfixture')

beforeAll(async()=>{
    await userfixture.setUpDatabase()
})

test('Create a new user',async()=>{
    const resp = await request(app).post('/user').query({
        fullname:'Raaja',
        email:'test@gmail.com',
        phoneNumber:1248953268
    }).expect(201)

    expect(resp.body._id).not.toEqual(null)
})

test('Creating user without name should throw error',async()=>{
    const resp = await request(app).post('/user').query({
        fullname:'',
        email:'test@gmail.com',
        phoneNumber:1248953268
    }).expect(400)

    expect(resp.body.message).toEqual("Name cannot be empty")
})

test('Creating user with invalid email should throw error',async()=>{
    const resp = await request(app).post('/user').query({
        fullname:'Raaja',
        email:'test@gmail',
        phoneNumber:1248953268
    }).expect(400)

    expect(resp.body.message).toEqual("Enter a valid Email address")
})

test('Creating user with invalid phone number should throw error',async()=>{
    const resp = await request(app).post('/user').query({
        fullname:'Raaja',
        email:'test@gmail.com',
        phoneNumber:1248
    }).expect(400)

    expect(resp.body.message).toEqual("Invalid mobile number")
})