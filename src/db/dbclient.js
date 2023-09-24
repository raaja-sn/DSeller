const moongose = require('mongoose')
const {SSMClient,GetParameterCommand} = require('@aws-sdk/client-ssm')
const userdb = require('../user/userdb/userdb')
const sellerdb = require('../seller/sellerdb/sellerdb')
const productdb = require('../product/productdb/productdb')
const orderdb = require('../order/orderdb/orderdb')

const getDbURL = async()=>{
    if(process.env.DB_URL){
        return process.env.DB_URL
    }
    try{
        const client = new SSMClient()
        const getCommand = new GetParameterCommand({
            name:'DSeller_DB_Password',
            WithDecryption:true
        })
        const dbPass = await client.send(getCommand)
        console.log(dbPass)
        return `mongodb+srv://dellseradmin:${dbPass}@dsellercluster.cwdi2eo.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`
    }catch(e){
        console.log(e)
        return 'mongodb://localhost:27017/DSeller?replicaSet=rs0'
    }
    
}

const DB_URL = process.env.DB_URL 

const connectDB = async ()=>{
    await moongose.connect(await getDbURL(),{autoIndex:false,useNewUrlParser:true})
}

connectDB()

module.exports = {
    userdb,
    sellerdb,
    productdb,
    orderdb
}

