const {ObjectId,default:mongoose} = require('mongoose')

/**
 * Schema for products placed in cart for an order
 */
const orderedProductSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:[true,'Ordered Product name cannot be empty'],
        trim:true
    },
    productId:{
        type:ObjectId,
        required:[true,'Ordered product Id cannot be empty'],
        validate:{
            validator:function(id){
                return mongoose.isValidObjectId(id)
            },
            message:'Ordered product Id is not valid'
        }
    },
    quantity:{
        type:Number,
        required:[true,'Quantity for an ordering product is required'],
        validate:{
            validator:function(quantity){
                return Number.isInteger(quantity)
            },
            message:'Quantity is invalid'
        },
        min:[1,'Minimum of 1 quantity is required to place the order']
    },
    price:{
        type:Number,
        required:[true,'Product price cannot be empty'],
        min:[1,'Product price cannot be less than 1'],
    }
})

/**
 * Schemna for a customer order
 */
const orderSchema = new mongoose.Schema({
    userId:{
        type:ObjectId,
        required:[true,`User's Id is required to place order`],
        validate:{
            validator:function(id){
                return mongoose.isValidObjectId(id)
            },
            message:`User's Id is invalid`
        }
    },
    invoiceNo:{
        type:String,
        required:[true,'Invoice number cannot be empty']
    },
    products:{
        type:[orderedProductSchema],
        default:[],
        validate:{
            validator:function(pArr){
                return pArr.length > 1
            },
            message:'Atleast one product should be added to the cart to place the order'
        }
    },
    purchaseDate:{
        type:Date,
        default:Date.now(),
    },
    billValue:{
        type:Number,
        required:[true,'Bill value cannot be empty'],
        min:[1,'Bill value must be greater than 0']
    },
    shippingCost:{
        type:Number,
        required:[true,'Shipping Cost cannot be empty'],
        min:[1,'Shipping Cost must be greater than 0']
    }
})

/**
 * Query and return a single order
 * @param {String} orderId 
 * @returns Promise to resolve the query
 */
orderSchema.methods.findAnOrder = function(orderId){
    return mongoose.model('Order',orderSchema).findById(orderId)
}

/**
 * Query and restun list of orders matching the filter passed
 * @param {any} filter Filter to match a list of records
 * @param {Number} pageNumber Page number for the list of records
 * @param {Number} pageSize No of records to return in a single query
 * @returns Promise to resolve the query
 */
orderSchema.methods.listOrders = function(filter,pageNumber,pageSize){
    return mongoose.model('Order',orderSchema)
    .find(filter)
    .select('_id invoiceNo billValue shippingCost purchaseDate')
    .limit(pageSize)
    .skip((pageNumber-1)*pageSize)
}

const Order  = mongoose.model('Order',orderSchema)

module.exports = Order