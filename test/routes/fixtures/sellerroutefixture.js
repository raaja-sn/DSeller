const mongoose = require('mongoose')
const Seller = require('../../../src/db/sellerdb/seller')

const setUpDatabase = async()=>{
    await Seller.deleteMany({})
    for(let i=1; i<=100; i++){
        await new Seller(getMockSeller(i)).save()
    }
}

const getMockSeller = (i)=>{
    const r = Math.floor(Math.random()*names.length)
    return{
        fullname:`${names[r]} ${i}`,
        email:'test@gmail.com',
        phoneNumber:number[r]
    }
}

const names = [
    'Mary Mackay','Frank Miller','Dan Oliver',
    'Jasmine Taylor','Felicity Bailey','Abigail Slater',
    'Abigail Oliver','Hannah Vaughan','John Sanderson',
    'Gabrielle Roberts',
] 

const number = [
    3457686745,3457126945,3457649675,
    7452686745,9456686745,3455567565,
    1258686745,5362686745,7954686745,
    8456686745
] 

let testSellerId 

module.exports = {
    setUpDatabase,
    testSellerId
}