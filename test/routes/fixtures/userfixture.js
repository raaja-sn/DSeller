const mongoose = require('mongoose')
const User = require('../../../src/db/userdb/user')

const setUpDatabase = async()=>{
    await User.deleteMany({})
}

module.exports = {
    setUpDatabase
}