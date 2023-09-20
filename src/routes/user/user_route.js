const express = require('express')
const routeUtils = require('../routeutils/routeutils')
const dbClient = require('../../db/dbclient')
const mongoose = require('mongoose')

const userRoute = express.Router()

userRoute.post('/user', async(req,resp)=>{
    try{
        const user = {
            fullname:req.query.fullname,
            email:req.query.email,
            phoneNumber:req.query.phoneNumber
        }
        const newUser = await dbClient.userdb.createNewUser(user)
        resp.status(201).send(newUser.getPublicProfile())
    }catch(e){
        console.log(e)
        sendErrorResponse(e,resp)
    }
})

userRoute.get('/user/:userId', async(req,resp)=>{
    try{
        if(!mongoose.isValidObjectId(req.params.userId)){
            throw(routeUtils.getError('User Id is invalid'))
        }
        const user = await dbClient.userdb.getUser(req.params.userId)
        resp.status(200).send(user.getPublicProfile())
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

userRoute.patch('/user/:userId',async(req,resp)=>{
    try{
        if(!mongoose.isValidObjectId(req.params.userId)){
            throw(routeUtils.getError('User Id is invalid'))
        }
        const query = req.query
        const user = {_id:req.params.userId}
        if(query.fullname){
            user.fullname = query.fullname
        }
        if(query.email){
            user.email = query.email
        }
        const updateUser = await dbClient.userdb.updateUser(user)
        resp.status(200).send(updateUser.getPublicProfile())
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

module.exports = userRoute