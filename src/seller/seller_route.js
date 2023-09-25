const express = require('express')
const dbClient = require('../db/dbclient')
const routeUtils = require('../routes/routeutils/routeutils')

const sellerRoute = express.Router()

sellerRoute.post('/seller',async(req,resp)=>{
    try{
        const seller = {
            fullname:req.query.fullname,
            email:req.query.email,
            phoneNumber:req.query.phoneNumber
        }
        const newSeller = await dbClient.sellerdb.createNewSeller(seller)
        if(!newSeller)throw(routeUtils.getError('Cannot create a new seller'))
        resp.status(201).send(newSeller.getPublicProfile())
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

sellerRoute.get('/seller/:sellerId?',async(req,resp)=>{
    try{
        const seller = await dbClient.sellerdb.getSeller(req.params.sellerId)
        if(!seller)throw(routeUtils.getError('Seller not found'))
        resp.status(200).send(seller.getPublicProfile())
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

sellerRoute.patch('/seller/:sellerId?',async(req,resp)=>{
    try{
        const query = req.query
        const seller = {_id:req.params.sellerId}
        if(query.fullname) seller.fullname = query.fullname
        if(query.email)seller.email = query.email
        console.log(seller)
        const updatedSeller = await dbClient.sellerdb.updateSeller(seller)
        if(!updatedSeller)throw(routeUtils.getError('Seller not found'))
        resp.status(200).send(updatedSeller.getPublicProfile())
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

sellerRoute.get('/listsellers',async(req,resp)=>{
    try{
        const query = req.query
        const filter = {}
        if(query.fullname){
            filter.fullname = {$regex:new RegExp(`${query.fullname}`),$options:'i'}
        }
        if(query.phoneNumber){
            filter.phoneNumber = {$regex:new RegExp(`${query.phoneNumber}`)}
        }
        let sort = ''
        if(query.sortBy){
            if(query.sortOrder === 'desc'){
                sort = sort.concat(`-${query.sortBy}`)
            }else{
                sort = sort.concat(`${query.sortBy}`)
            }
        }
        const sList = await dbClient.sellerdb.getSellersList(filter,query.pageNumber,query.pageSize,sort)
        resp.status(200).send(sList)
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

module.exports = sellerRoute
