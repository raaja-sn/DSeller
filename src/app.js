const db = require('./db/dbclient')
const express = require('express')
const userRoute = require('./user/user_route')
const sellerRoute = require('./seller/seller_route')
const productRoute = require('./product/product_route')
const orderRoute = require('./order/order_route')

const app = express()
app.use(express.json())
app.use(userRoute)
app.use(sellerRoute)
app.use(productRoute)
app.use(orderRoute)

app.get('/',(res,resp)=>{
    resp.status(200).send({
        message:'Welcome to DSeller'
    })
})

module.exports = app