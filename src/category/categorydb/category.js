const  mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true, 
    },
    subCategories:{
        type:[String],
        default:[]
    },
    image:{
        type:String,
        default:""
    }
})

categorySchema.methods.updateImage = function(name,imgStr){
    console.log(name)
    return mongoose.model('Category',categorySchema).findOneAndUpdate({
        name:name
    },{
        image:imgStr
    },{new:true})
}

categorySchema.methods.addSubCategories = function(name,sCategories){
    return mongoose.model('Category',categorySchema).findOneAndUpdate({
        name:name
    },{
        $push : { subCategories : sCategories}
    },{new:true})
}

const Category = mongoose.model('Category',categorySchema)

module.exports = Category