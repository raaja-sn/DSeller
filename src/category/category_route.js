const express = require('express')
const categoryDb = require('./categorydb/categorydb')
const multer = require('multer')
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3')
const routeUtils = require('../routes/routeutils/routeutils')

const categoryRoute = express.Router()

const addImageToS3 = async(category,categoryImg,extension) =>{
    const client = new S3Client({
        region:"ap-south-1"
    })
    const bucketName = process.env.S3_BUCKET || "dseller"
    const key = `categories/${category}.${extension}`
    const putImageCommand = new PutObjectCommand(
        {
            Bucket: bucketName,
            Key: key,
            Body: categoryImg
        }
    )
    await client.send(putImageCommand)
    return `https://${bucketName}.s3.ap-south-1.amazonaws.com/${key}`
}

const uploadCategoryImg = multer({
    fileFilter:(req,file,cb)=>{
        if(!file.originalname.match(/\.(jpg|jpeg|png|webp)$/gi)){
            return cb(Error("Unsupported image format. Only JPG, JPEG, PNG and WEBP are supported"))
        }
        return cb(undefined,true)
    }
})

categoryRoute.post('/category',async(req,resp)=>{
    try{
        const category = {}
        category.name = req.body.name
        category.subCategories = req.body.subCategories
        const newCategory = await categoryDb.createCategory(category)
        resp.status(201).send(newCategory)
    }catch(e){
        sendErrorResponse(e,resp)
    }
},(error,req,resp,next)=>{
    resp.status(400).send(error.message)
})

categoryRoute.patch('/category/img/:categoryName?',uploadCategoryImg.single("categoryImg"),async(req,resp)=>{
    try {
        let imgStr = ""
        if (req.file) {
            imgStr = await addImageToS3(req.params.categoryName, req.file.buffer,getImageExtension(req))
        }
        const updatedCategory = await categoryDb.updateCategoryImage(req.params.categoryName, imgStr)
        if(!updatedCategory) throw(routeUtils.getError('Category not found'))
        resp.status(200).send(updatedCategory)
    } catch (e) {
        sendErrorResponse(e, resp)
    }
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

categoryRoute.patch('/category/:categoryName?',async(req,resp)=>{
    try{
        const category = await categoryDb.addSubCategories(
            req.params.categoryName,req.body.subCategories)
        if(!category)throw(routeUtils.getError('Category not found'))
        resp.status(200).send(category)
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

categoryRoute.get('/category',async(req,resp)=>{
    try{
        const categories = await categoryDb.getCategories()
        resp.status(200).send(categories)
    }catch(e){
        sendErrorResponse(e,resp)
    }
})

const sendErrorResponse = function(e,resp){
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

module.exports = categoryRoute