const moongose = require('mongoose')
const userdb = require('../user/userdb/userdb')
const sellerdb = require('../seller/sellerdb/sellerdb')
const productdb = require('../product/productdb/productdb')
const orderdb = require('../order/orderdb/orderdb')

const DB_URL = process.env.DB_URL || 'mongodb+srv://dellseradmin:Qefdb7Z3tg45ow9N@dsellercluster.cwdi2eo.mongodb.net/?'

const connectDB = async ()=>{
    await moongose.connect(DB_URL,{autoIndex:false,useNewUrlParser:true})
}

connectDB()

module.exports = {
    userdb,
    sellerdb,
    productdb,
    orderdb
}

