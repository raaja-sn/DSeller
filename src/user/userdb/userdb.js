
const User = require('./user')
const dbUtils = require('../../db/dbutils/dbUtils')
const { default: mongoose } = require('mongoose')

/**
 * Create a new user in Users Collection
 * @param {any} user Pass a user object, following the structure of the User Schema
 * @returns 
 */
const createNewUser = async (user)=>{
    try{
        const newUser = new User({
            fullname:user.fullname,
            phoneNumber:user.phoneNumber,
            email:user.email,
            creation:user.creation
        })
        return await newUser.save()
    }catch(e){
        throw(dbUtils.getErrorMessage(e))
    }
}

/**
 * Fetch a user from the Users collection
 * @param {String} userId User's Id to be passed 
 * @returns Returns a User if found , else throw an error
 */
const getUser = async(userId)=>{
    try{
        if(!mongoose.isValidObjectId(userId)){
            throw({
                name:dbUtils.customErrorTag,
                message:'Invalid user Id'
            })
        }
        const user = await new User().findAUser(userId)
        return user
    }catch(e){
        throw(dbUtils.getErrorMessage(e))
    }
}

/**
 * 
 * @param {any} newUserData Object following the same User Schema, including the _id
 * of the user to update
 * @returns Returns the updated User if successful, otherwise throws error 
 */
const updateUser = async(newUserData) =>{
    try{
        if(!mongoose.isValidObjectId(newUserData._id)){
            throw({
                name:dbUtils.customErrorTag,
                message:'Invalid user Id'
            })
        }
        return await User.findOneAndUpdate({_id:newUserData._id},newUserData,{new:true,runValidators:true})
    }catch(e){
        throw(dbUtils.getErrorMessage(e))
    }
}

module.exports = {
    createNewUser,
    getUser,
    updateUser
}