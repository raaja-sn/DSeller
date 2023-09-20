const db = require('./db/dbclient')
const express = require('express')
const userRoute = require('./routes/user/user_route')

const app = express()
app.use(express.json())
app.use(userRoute)

app.get('/',(res,resp)=>{
    resp.status(200).send({
        message:'Welcome to DSeller'
    })
})

module.exports = app