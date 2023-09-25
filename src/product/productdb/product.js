const  mongoose = require('mongoose')

/**
 *  Mongoose schema for Products collection
 */
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        index:true,
        required:[true,'Product name cannot be empty'],
        maxLength:[60,'Product name must me less than 60 characters long']
    },
    category:{
        type:String,
        trim:true,
        index:true,
        required:[true,'Category cannot be empty']
    },
    subCategory:{
        type:String,
        trim:true,
        index:true,
        required:[true,'Sub Category cannot be empty'],
    },
    descriptionShort:{
        type:String,
        trim:true,
    },
    descriptionLong:{
        type:String,
        required:[true,'Enter a valid product description'],
        maxLength:[1000,'Product Description must be less than 1000 characters long']
    },
    price:{
        type:Number,
        required:[true,'Enter a valid product cost'],
        min:[1,'Price cannot be less tha 1']
    },
    productPictures:{
        type:[String],
        default:[]
    },
    stock:{
        type:Number,
        default:0,
        min:[0,'Stock cannot be lower than 0'],
        validate:{
            validator:(stock)=>{
                return Number.isInteger(stock)
            },
            message:'Stock cannot be a decimal value'
        }
    },
    shippingCost:{
        type:Number,
        min:[0,'Shipping cost cannot be less tha 0']
    },
    creation:{
        type:Date,
        default:Date.now()
    }
})

/**
 * Find a product
 * @param {String} productId Id of the Product to be found
 * @returns Returns a promise to resolve
 */
productSchema.methods.findProduct = function(productId){
    return mongoose.model('Product',productSchema).findOne({_id:productId})
}

/**
 * Delete a product
 * @param {String} productId Id of the Product to be deleted
 * @returns Returns a promise to resolve
 */
productSchema.methods.deleteProduct =  function(productId){
    return mongoose.model('Product',productSchema).deleteOne({_id:productId})
}

/**
 * Paginate the products from the products collection. A filter is passed to match the records
 * @param {any} filter Filter to match records
 * @param {Number} pageNumber Page number to fetch records for specific page. Starts from 1
 * @param {number} pageSize No of records to return per list. Max limit is 100
 * @param {String} sort The sort string to sort the records returned. 
 * @returns Returns a promise to resolve
 */
productSchema.methods.paginateProducts = function(filter, pageNumber, pageSize,sort){
    return mongoose.model('Product',productSchema).find(filter)
    .select('name productPictures category subCategory price _id')
    .sort(sort)
    .limit(pageSize)
    .skip((pageNumber-1)*pageSize)
}

const Product = mongoose.model('Product',productSchema)

module.exports = Product