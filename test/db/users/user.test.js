const dbclient = require('../../../src/db/dbclient')
const dbfixture = require('../../fixtures/dbfixture')

beforeAll(async ()=>{
    dbfixture.users.testuser_2 = await dbfixture.users.setUpDatabase()
})

test('Create a new User', async ()=>{
    const user = await dbclient.userdb.createNewUser(dbfixture.users.testuser)
    expect(user.phoneNumber).toEqual(dbfixture.users.testuser.phoneNumber)
})

test('Throw error if validation failed when creating user without phone number', async()=>{
    try{
        delete dbfixture.users.testuser.phoneNumber
        await dbclient.userdb.createNewUser(dbfixture.users.testuser)
    }catch(e){
        expect(e.message).toEqual('Phone number cannot be empty')
    }
})

test('Throw error if validation failed when creating user without valid email', async()=>{
    try{
        dbfixture.users.testuser.email = 'test'
        await dbclient.userdb.createNewUser(dbfixture.users.testuser)
    }catch(e){
        expect(e.message).toEqual('Enter a valid Email address')
    }
})

test('Find and return a valid User',async()=>{
    try{
        const user = await dbclient.userdb.getUser(dbfixture.users.testuser_2._id)
        expect(user.phoneNumber).toEqual(dbfixture.users.testuser_2.phoneNumber)
    }catch(e){
        expect(e.message).toEqual('User not found')
    }
})

test('Throw Error if no user found for the given id', async()=>{
    try{
        const user = await dbclient.userdb.getUser('')
        expect(user.phoneNumber).toEqual(dbfixture.users.testuser_2.phoneNumber)
    }catch(e){
        expect(e.message).toEqual('Invalid user Id')
    }
})

test('Update existing user', async()=>{
    try{
        const user = JSON.parse(JSON.stringify(dbfixture.users.testuser_2))
        delete user.phoneNumber
        user.email = 'raaja@gmail.com'
        user.fullname = 'Raaja'
        const newUser = await dbclient.userdb.updateUser(user)
        expect(newUser.fullname).toEqual(user.fullname)
    }catch(e){
        expect(e.message).toEqual('User not found')
    }
})

test('Updating user with invalid email throws error', async()=>{
    try{
        const user = JSON.parse(JSON.stringify(dbfixture.users.testuser_2))
        delete user.phoneNumber
        user.email = 'raaja'
        await dbclient.userdb.updateUser(user)
    }catch(e){
        expect(e.message).toEqual('Enter a valid Email address')
    }
})

test('Updating User without email throws error', async()=>{
    try{
        const user = JSON.parse(JSON.stringify(dbfixture.users.testuser_2))
        delete user.phoneNumber
        user.email = ''
        await dbclient.userdb.updateUser(user)
    }catch(e){
        expect(e.message).toEqual('Email cannot be empty')
    }
})