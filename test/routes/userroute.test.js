const request = require('supertest')
const app = require('../../src/app')
const userfixture = require('./fixtures/userroutefixture')

beforeAll(async()=>{
    await userfixture.setUpDatabase()
})

test('Create a new user',async()=>{
    const resp = await request(app).post('/user').query({
        fullname:'Raaja',
        email:'test@gmail.com',
        phoneNumber:1248953268
    }).expect(201)
    userfixture.testUserId = resp.body._id
    expect(resp.body._id).not.toEqual(null)
})

test('Creating user without name sends error response',async()=>{
    const resp = await request(app).post('/user').query({
        fullname:'',
        email:'test@gmail.com',
        phoneNumber:1248953268
    }).expect(400)

    expect(resp.body.message).toEqual("Name cannot be empty")
})

test('Creating user with invalid email sends error response',async()=>{
    const resp = await request(app).post('/user').query({
        fullname:'Raaja',
        email:'test@gmail',
        phoneNumber:1248953268
    }).expect(400)

    expect(resp.body.message).toEqual("Enter a valid Email address")
})

test('Creating user with invalid phone number sends error response',async()=>{
    const resp = await request(app).post('/user').query({
        fullname:'Raaja',
        email:'test@gmail.com',
        phoneNumber:1248
    }).expect(400)

    expect(resp.body.message).toEqual("Invalid mobile number")
})

test('Get a registered user',async()=>{
    const resp = await request(app).get(`/user/${userfixture.testUserId}`)
    .expect(200)
    expect(resp.body._id).not.toEqual(null)
})

test('Get a user with invalid user id sends error response',async()=>{
    const resp = await request(app).get(`/user/650bdd2d9e38ee0f70396058`)
    .expect(400)
    expect(resp.body.message).toEqual('User not found')
})

test('Update the user',async()=>{
    const userResp = await request(app).post('/user').query({
        fullname:'Raaja',
        email:'test@gmail.com',
        phoneNumber:1248953268
    }).expect(201)
    const resp = await request(app).patch(`/user/${userResp.body._id}`).query({
        fullname:'Raaja the Raaja',
        phoneNumber:8845884525
    })
    .expect(200)
    expect(resp.body.fullname).toEqual('Raaja the Raaja')
})

test('Updating a user with empty user Id sends error response',async()=>{
    const resp = await request(app).patch(`/user/`).query({
        fullname:'Raaja the Raaja'
    })
    .expect(400)
    expect(resp.body.message).toEqual('Invalid user Id')
})

test('Updating a user with invalid user Id sends error response',async()=>{
    const resp = await request(app).patch(`/user/650bdd2d9e38ee0f70396058`).query({
        fullname:'Raaja the Raaja'
    })
    .expect(400)
    expect(resp.body.message).toEqual('User not found')
})



