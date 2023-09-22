const Seller = require('../../src/seller/sellerdb/seller')

const testseller = {
    fullname:'Seller Test',
    phoneNumber:'3474848338',
    email:'test_seller@gamil.com',
    creation:Date.now()
}

const mockSeller = {
    fullname:'Seller Test 2',
    phoneNumber:'3222222222',
    email:'test_seller@gamil.com',
    creation:Date.now()
}

const getMockSeller = (i)=> {
    return {
        fullname: `Seller Test ${i}`,
        phoneNumber: `${3222222222+i}`,
        email: 'test_seller@gamil.com',
        creation: Date.now()
    }
}

let testseller_2
const setUpDatabase = async ()=> {
    try{
        await Seller.deleteMany({})
        for(i=1; i<=100; i++){
            await new Seller(getMockSeller(i)).save()
        }
        return await new Seller(mockSeller).save()
    }catch(e){
        console.log(e)
    }
}

module.exports = {
    testseller,
    testseller_2,
    setUpDatabase
}