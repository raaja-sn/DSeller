const mongoose = require('mongoose')
const Product = require('./product')
const dbUtils = require('../dbutils/dbUtils')

const getInvalidObjectIdException = {
    name:dbUtils.customErrorTag,
    message:'Product Id is invalid'
}

/**
 * Create a new product
 * @param {any} product The new product object to be created. The object should follow the schema of Product colleciton
 * @returns The new Product
 */
const createNewProduct = async(product)=>{
    try{
        return await new Product(product).save()
    }catch(e){
        throw(dbUtils.getErrorMessage(e))
    }
}

/**
 * Update exisiting product
 * @param {any} product The product object to be updated with the correct product Id in _id field.
 *  The object should follow the schema of Product colleciton
 * @returns The updated Product
 */
const updateProduct = async(product) =>{
    try{
        if(!mongoose.isValidObjectId(product._id)) throw(getInvalidObjectIdException)
        return await Product.findByIdAndUpdate({_id:product._id},product,{new:true,runValidators:true})
    }catch(e){
        throw(dbUtils.getErrorMessage(e))
    }
}

/**
 * Find a product in Products collection
 * @param {String} productId Id of the product to be fetched
 * @returns The product associated witht the productId
 */
const getExistingProduct = async(productId) =>{
    try{
        if(!mongoose.isValidObjectId(productId)) throw(getInvalidObjectIdException)
        return await new Product().findProduct(productId)
    }catch(e){
        throw(dbUtils.getErrorMessage(e))
    }
}

/**
 * Delete a product from Products collection
 * @param {String} productId Id of the product to be fetched
 * @returns True if the product is deleted
 */
const deleteProduct = async(productId) =>{
    try{
        if(!mongoose.isValidObjectId(productId)) throw(getInvalidObjectIdException)
        const modified = await new Product().deleteProduct(productId)
        if(modified < 1){
            throw('Unable to delete product')
        }
        return true
    }catch(e){
        throw(dbUtils.getErrorMessage(e))
    }
}

/**
 * Get a list of products matching the filter
 * @param {any} filter Filter to match the product records
 * @param {Number} pageNumber Page number to fetch set of records matching the search term and
 * @param {Number} pageSize Number of records to return per page
 * @returns List of products 
 */
const getProducts = async(filter, pageNumber, pageSize) =>{
    try{
        if(pageNumber < 1) return []
        if(pageSize <1 || pageSize >100) return []
        return await new Product().paginateProducts(filter,pageNumber,pageSize)
    }catch(e){
        throw(dbUtils.getErrorMessage(e))
    }
}

module.exports = {
    createNewProduct,
    updateProduct,
    deleteProduct,
    getExistingProduct,
    getProducts
}

