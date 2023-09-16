const dbClient = require('../../../src/db/dbclient')
const dbfixture = require('../../fixtures//dbfixture')


beforeAll(async()=>{
    try{
        dbfixture.sellers.testseller_2 = await dbfixture.sellers.setUpDatabase()
    }catch(e){
        console.log(e)
    }
})

test('create a new seller',async()=>{
    const seller = await dbClient.sellerdb.createNewSeller(dbfixture.sellers.testseller)
    expect(seller.fullname).toEqual('Seller Test')
})

test('Throw error when email is empty', async()=>{
    try{
        const seller = {...dbfixture.sellers.testseller}
        delete seller.email
        await dbClient.sellerdb.createNewSeller(seller)
    }catch(e){
        expect(e.message).toEqual('Email cannot be empty')
    }
})

test('Throw error when email validation failed', async()=>{
    try{
        const seller = {...dbfixture.sellers.testseller}
        seller.email = 'Raaja'
        await dbClient.sellerdb.createNewSeller(seller)
    }catch(e){
        expect(e.message).toEqual('Enter a valid Email address')
    }
})

test('Throw error when phone number is empty', async()=>{
    try{
        const seller = {...dbfixture.sellers.testseller}
        delete seller.phoneNumber
        await dbClient.sellerdb.createNewSeller(seller)
    }catch(e){
        expect(e.message).toEqual('Phone number cannot be empty')
    }
})

test('Throw error when phone number validation failed', async()=>{
    try{
        const seller = {...dbfixture.sellers.testseller}
        seller.phoneNumber = 'dsfsdf'
        await dbClient.sellerdb.createNewSeller(seller)
    }catch(e){
        expect(e.message).toEqual('Invalid mobile number')
    }
})

test('Get a Seller', async()=>{
    const seller = await dbClient.sellerdb.getSeller(dbfixture.sellers.testseller_2._id)
    expect(seller.phoneNumber).toBe('3222222222')
})

test('when no seller is found throw error', async()=>{
    try{
        await dbClient.sellerdb.getSeller('sdfsd')
    }catch(e){
        expect(e.message).toBe('Invalid seller Id')
    }
})

test('Update a seller', async()=>{
    const newSeller = JSON.parse(JSON.stringify(dbfixture.sellers.testseller_2))
    delete newSeller.phoneNumber
    newSeller.fullname = 'Seller test updated'
    const seller = await dbClient.sellerdb.updateSeller(newSeller)
    expect(seller.fullname).toBe('Seller test updated')
})

test('Updating a seller without email throws error', async()=>{
    try {
        const newSeller = JSON.parse(JSON.stringify(dbfixture.sellers.testseller_2))
        delete newSeller.phoneNumber
        newSeller.email = ''
        const seller = await dbClient.sellerdb.updateSeller(newSeller)
    } catch (e) {
        expect(e.message).toEqual('Email cannot be empty')
    }
})

test('Updating a seller with invalid email throws error', async()=>{
    try {
        const newSeller = JSON.parse(JSON.stringify(dbfixture.sellers.testseller_2))
        delete newSeller.phoneNumber
        newSeller.email = 'raaja'
        const seller = await dbClient.sellerdb.updateSeller(newSeller)
    } catch (e) {
        expect(e.message).toEqual('Enter a valid Email address')
    }
})

test('should paginate seller', async()=>{
    const sList = await dbClient.sellerdb.getSellersList(5,10)
    console.log(sList)
})