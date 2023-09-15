const mongoose = require('mongoose')
const validator = require('validator')

/**
 * Mongoose Schema for Seller model
 */
const sellerSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:[true,'Name cannot be empty'],
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:[true,'Email cannot be empty'],
        trim:true,
        validate: {
            validator:function(email){
                return validator.isEmail(email)
            },
            message:"Enter a valid Email address"
        }
    },
    phoneNumber:{
        type:String,
        required:[true,'Phone number cannot be empty'],
        unique:[true,'Phone number already exists'],
        trim:true,
        index:true,
        validate:{
            validator:function(pNumber){
                return validator.isMobilePhone(pNumber)
            },
            message:'Invalid mobile number'
        }
    },
    creation:{
        type:Date
    }
})

/**
 * Get a seller using the object Id of the document
 * @param {String} sellerId Object Id of the seller
 * @returns 
 */
sellerSchema.methods.findASeller = function(sellerId){
    return mongoose.model('Seller',sellerSchema).findOne({_id:sellerId})
}

/**
 * Get list of sellers with pagination.
 * @param {Number} pageNumber 
 * @param {Number} pageSize 
 * @returns 
 */
sellerSchema.methods.getSellers = function(pageNumber,pageSize){
    return mongoose.model('Seller',sellerSchema).find()
    .select('fullname phoneNumber _id')
    .limit(pageSize)
    .skip((pageNumber-1)*pageSize)
}

const Seller = mongoose.model('Seller',sellerSchema)

module.exports = Seller