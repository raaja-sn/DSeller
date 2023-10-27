const express = require('express')
const multer = require('multer')
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const dbClient = require('../db/dbclient')
const routeUtils = require('../routes/routeutils/routeutils')
const { default: mongoose } = require('mongoose')

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

const addToS3 = async(file,productId,imageName,extension) =>{
    const client = new S3Client({
        region: "ap-south-1"
    })
    const bucketName = process.env.S3_BUCKET || "dseller"
    const imageKey = `products/${productId}/${imageName}.${extension}`
    const uploadImageCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key:imageKey,
        Body: file.buffer
    })
    await client.send(uploadImageCommand)
    return `https://${bucketName}.s3.ap-south-1.amazonaws.com/${imageKey}`
}

const uploadProductImage = multer({
     fileFilter(req, productImageFile, cb){
        if(!productImageFile.originalname.match(/\.(jpg|jpeg|png|webp)$/gi)){
            return cb(Error('Unsupported image format. Only JPG, JPEG, PNG and WEBP are supported'))
        }
        return cb(undefined,true)
     }
})

productRoute.post('/product/image/:productId?',uploadProductImage.single('productImage'),async(req,resp) =>{
    try{
        let imgUrl = ""
        const productWithoutImage = await dbClient.productdb.addProductPicture(req.params.productId,"mock")
        if(!productWithoutImage) throw(routeUtils.getError('Invalid Product Id'))
        const imageId = productWithoutImage.productPictures[productWithoutImage.productPictures.length-1]._id
        if(req.file){
            imgUrl = await addToS3(req.file,req.params.productId,imageId,getImageExtension(req))
        }
        const product = await dbClient.productdb.updateProductImage(req.params.productId,imageId,imgUrl)
        resp.status(201).send(product)
    }catch(e){
        sendErrorResponse(e,resp)
    }
},(error,req,resp,next)=>{
    resp.status(400).send({
        message: error.message
    })
})

productRoute.patch('/product/image/:productId?',uploadProductImage.single('productImage'),async(req,resp) =>{
    try{
        if(!mongoose.isValidObjectId(req.body.imageId))throw(routeUtils.getError(`Product's Image Id is invalid`))
        let imgUrl = ""
        if(req.file){
            imgUrl = await addToS3(req.file,req.params.productId,req.body.imageId,getImageExtension(req))
        }
        const product = await dbClient.productdb.updateProductImage(req.params.productId,req.body.imageId,imgUrl)
        if(!product) throw(routeUtils.getError('Invalid Product Id'))
        resp.status(201).send(product)
    }catch(e){
        sendErrorResponse(e,resp)
    }
},(error,req,resp,next)=>{
    resp.status(400).send({
        message: error.message
    })
})



const getImageExtension = (req)=>{
    let extension = ""
    if(req.file.originalname.match(/\.jpg$/g)){
        extension = 'jpg'
    }else if(req.file.originalname.match(/\.jpeg$/g)){
        extension = 'jpeg'
    }else if(req.file.originalname.match(/\.png$/g)){
        extension = 'png'
    }else if(req.file.originalname.match(/\.webp$/g)){
        extension = 'webp'
    }
    return extension
}

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
        sort = sort.concat(' -_id')
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