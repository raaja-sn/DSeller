const  mongoose = require('mongoose')

const subCategorySchema = mongoose.Schema({
    name:{
        type:String,
        trim:true,
    },
    category:{
        type:String,
        trim:true,
    }
})

const SubCategory = mongoose.model('SubCategory',subCategorySchema)

module.exports = SubCategory