const  mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        trim:true,
        
    }
})

const Category = mongoose.model('Category',categorySchema)

module.export = Category