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
    invoiceNo:{
        type:Number,
        default:1,
    },
    creation:{
        type:Date
    }
})

/**
 * Find a user
 * @param {String} userId User Id of the user to be fetched
 * @returns The user if found or undefined if user cannot be found
 */
userSchema.methods.findAUser = function(userId){
    return mongoose.model('User',userSchema).findOne({_id:userId})
}

/**
 * Find a User withe user ID and the transaction session. Used to get a user in the same running transaction
 * @param {String} userId Id of the User
 * @param {mongoose.ClientSession} session Session of the transaction
 * @returns Promise to resolve
 */
userSchema.methods.findAUserWithSession = function(userId,session){
    return mongoose.model('User',userSchema).findOne({_id:userId}).session(session)
}

userSchema.methods.getPublicProfile = function(){
    const user = this.toObject()
    delete user.invoiceNo
    delete user.__v
    return user
}

const User = mongoose.model('User',userSchema)

module.exports = User