const express = require('express')
const dbclient = require('../db/dbclient')
const routUtils = require('../routes/routeutils/routeutils')

const orderRoute = express.Router()

orderRoute.post('/order',async(req,resp)=>{
    try{
        const body = req.body
        const order = {
            userId: body.userId,
            products:body.products
        }
        const newOrder = await dbclient.orderdb.createNewOrder(order)
        if(!newOrder[0]) throw(routUtils.getError('Cannot create order'))
        resp.status(201).send(newOrder[0])
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

orderRoute.get('/order/:orderId?',async(req,resp)=>{
    try{
        const order = await dbclient.orderdb.findOrder(req.params.orderId)
        if(!order)throw(routUtils.getError('Order not found'))
        resp.status(200).send(order)
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

orderRoute.get('/listorders/:userId?',async(req,resp)=>{
    try{
        const query = req.query
        const filter = {}
        filter.userId = req.params.userId
        const sort = ''
        if(query.sortBy){
            if(query.sortOrder === 'desc'){
                sort = sort.concat(`-${query.sortBy}`)
            }else{
                sort = sort.concat(`${query.sortBy}`)
            }
        }
        const orderList = await dbclient.orderdb.listOrders(filter,query.pageNumber,query.pageSize,sort)
        resp.status(200).send(orderList)
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

const sendErrorResponse = (e,resp)=>{
    if(!e.code){
        resp.status(500).send(e.message)
        return
    }
    if(e.code === 3){
        resp.status(500).send(e)
        return
    }
    resp.status(400).send(e)
}

module.exports = orderRoute