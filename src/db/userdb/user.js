const mongoose = require('mongoose')
const validator = require('validator')

/**
 *  Mongoose Schema for User Model
 */
const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:[true,'Name cannot be empty'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Email cannot be empty'],
        trim:true,
        index:true,
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
 * Mongoose instance method for User Schema
 * @param {String} userId User Id of the user to be fetched
 * @returns The user if found or undefined if user cannot be found
 */
userSchema.methods.findAUser = function(userId){
    return mongoose.model('User',userSchema).findOne({_id:userId})
}

const User = mongoose.model('User',userSchema)

module.exports = User