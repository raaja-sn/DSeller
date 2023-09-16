const moongose = require('mongoose')
const userdb = require('./userdb/userdb')
const sellerdb = require('./sellerdb/sellerdb')
const productdb = require('./productdb/productdb')

const connectDB = async ()=>{
    await moongose.connect(process.env.DB_URL,{autoIndex:false})
}

connectDB()

module.exports = {
    userdb,
    sellerdb,
    productdb
}

