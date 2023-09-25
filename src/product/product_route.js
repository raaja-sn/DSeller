const express = require('express')
const dbClient = require('../db/dbclient')
const routeUtils = require('../routes/routeutils/routeutils')

const productRoute = express.Router()

productRoute.post('/product',async(req,resp)=>{
    try{
        const body = req.body
        const product = {
            name:body.name,
            category:body.category,
            subCategory:body.subCategory,
            descriptionShort:body.descriptionShort,
            descriptionLong:body.descriptionLong,
            price:body.price,
            stock:body.stock,
            shippingCost:body.shippingCost
        }
        const newProduct = await dbClient.productdb.createNewProduct(product)
        if(!newProduct)throw(routeUtils.getError('Cannot create product'))
        resp.status(201).send(newProduct)
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

productRoute.get('/product/:productId?',async(req,resp)=>{
    try{
        const product = await dbClient.productdb.getExistingProduct(req.params.productId)
        if(!product)throw(routeUtils.getError('Product not found'))
        resp.status(200).send(product)
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

const getUpdateData = (body)=>{
    const updateData = {}
    if(body.name) updateData.name = body.name
    if(body.category) updateData.category = body.category
    if(body.subCategory) updateData.subCategory = body.subCategory
    if(body.descriptionShort) updateData.descriptionShort = body.descriptionShort
    if(body.descriptionLong) updateData.descriptionLong = body.descriptionLong
    if(body.price) updateData.price = body.price
    if(body.stock) updateData.stock = body.stock
    if(body.shippingCost) updateData.shippingCost = body.shippingCost
    return updateData
}

productRoute.patch('/product/:productId?',async(req,resp)=>{
    try{
        const product = getUpdateData(req.body)
        product._id = req.params.productId
        const updatedProduct = await dbClient.productdb.updateProduct(product)
        if(!updatedProduct)throw(routeUtils.getError('Product not found'))
        resp.status(200).send(updatedProduct)
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

productRoute.delete('/product/:productId?',async(req,resp)=>{
    try{
        const isDeleted = await dbClient.productdb.deleteProduct(req.params.productId)
        if(!isDeleted)throw(routeUtils.getError('Unable to delete product route'))
        resp.status(200).send({isDeleted})
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

productRoute.get('/listproducts',async(req,resp)=>{
    try{
        const query = req.query
        const filter = {}
        if(query.name){
            filter.name = {$regex : new RegExp(`${query.name}`),$options:'i' }
        }
        if(query.category){
            filter.category = {$regex:new RegExp(`${query.category}`)}
        }
        if(query.subCategory){
            filter.subCategory = {$regex:new RegExp(`${query.subCategory}`)}
        }
        let sort = ''
        if(query.sortBy){
            if(query.sortOrder === 'desc'){
                sort = sort.concat(`-${query.sortBy}`)
            }else{
                sort = sort.concat(`${query.sortBy}`)
            }
        }
        const productList = await dbClient.productdb.getProducts(filter,query.pageNumber,query.pageSize,sort)
        resp.status(200).send(productList)
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

const sendErrorResponse = (e, resp)=>{
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

module.exports = productRoute