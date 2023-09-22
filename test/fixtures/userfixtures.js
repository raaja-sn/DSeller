const User = require('../../src/user/userdb/user')

const testuser = {
    fullname:'Test User',
    phoneNumber:'3474848338',
    email:'test@gamil.com',
    creation:Date.now()
}

const mockUser = {
    fullname:'Test User',
    phoneNumber:'3222222222',
    email:'test@gamil.com',
    creation:Date.now()
}

var testuser_2
const setUpDatabase = async ()=> {
    try{
        await User.deleteMany({})
        return await new User(mockUser).save()
    }catch(e){
        console.log(`Test Db setup failed`)
    }
}

module.exports = {
    testuser,
    testuser_2,
    setUpDatabase
}