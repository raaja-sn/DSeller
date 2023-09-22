const moongose = require('mongoose')
const userdb = require('../user/userdb/userdb')
const sellerdb = require('../seller/sellerdb/sellerdb')
const productdb = require('../product/productdb/productdb')
const orderdb = require('../order/orderdb/orderdb')

const connectDB = async ()=>{
    await moongose.connect(process.env.DB_URL,{autoIndex:false,useNewUrlParser:true})
}

connectDB()

module.exports = {
    userdb,
    sellerdb,
    productdb,
    orderdb
}

