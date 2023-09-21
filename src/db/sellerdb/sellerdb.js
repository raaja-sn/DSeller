const Seller = require('./seller')
const dbUtils = require('../dbutils/dbUtils')
const { default: mongoose } = require('mongoose')

/**
 * Create a new Seller
 * @param {any} seller Object with Seller details following the Seller Schema
 * @returns The created seller
 */
const createNewSeller = async(seller)=>{
    try{
        const newSeller = {
            fullname:seller.fullname,
            phoneNumber:seller.phoneNumber,
            email:seller.email,
            creation:seller.creation
        }
        return await new Seller(newSeller).save()
    }catch(e){
        throw(dbUtils.getErrorMessage(e))
    }
}

/**
 * Get a seller
 * @param {String} sellerId The Seller Object Id
 * @returns The Seller associated with the Id
 */
const getSeller = async(sellerId)=>{
    try{
        if(!mongoose.isValidObjectId(sellerId)){
            throw({
                name:dbUtils.customErrorTag,
                message:'Invalid seller Id'
            })
        }
        return await new Seller().findASeller(sellerId)
    }catch(e){
        throw(dbUtils.getErrorMessage(e))
    }
}

/**
 * Update the seller details
 * @param {any} newSellerData An Object following the structure of seller schema
 * @returns Returns the updated seller
 */
const updateSeller = async(newSellerData)=>{
    try{
        if(!mongoose.isValidObjectId(newSellerData._id)){
            throw({
                name:dbUtils.customErrorTag,
                message:'Invalid seller Id'
            })
        }
        return await Seller.findByIdAndUpdate(newSellerData._id,newSellerData,{new:true, runValidators:true})
    }catch(e){
        throw(dbUtils.getErrorMessage(e))
    }
}

/**
 * Get a list of Sellers from the pageNumber with the page size. (pageNumber-1)*pageSize
 * is used internally to fetch only the requested page record
 * @param {any} filter The filter to match the seller records
 * @param {Number} pageNumber Starts with 1
 * @param {Number} pageSize Value from 10 to 100
 * @param {String} sort The sort order and field matching fields of the schema 
 * ex. -creation to sort in descending order with the creation field
 */
const getSellersList = async(filter,pageNumber,pageSize,sort = 'creation') =>{
    try{
        if(pageNumber <1) return []
        if(pageSize <1 || pageSize>100) return []
        return await new Seller().getSellers(filter,pageNumber,pageSize,sort)
    }catch(e){
        throw(dbUtils.getErrorMessage(e))
    }
}

module.exports = {
    createNewSeller,
    getSeller,
    updateSeller,
    getSellersList
}