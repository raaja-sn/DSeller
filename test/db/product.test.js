const dbclient = require('../../src/db/dbclient')
const dbfixtures = require('../fixtures/dbfixture')

beforeAll(async()=>{
    dbfixtures.products.productTest_2 = 
    await dbfixtures.products.setUpDatabase()
})

test('create a new product',async()=>{
    const product = await dbclient.productdb.createNewProduct(dbfixtures.products.productTest)
    expect(product.name).toEqual('HyperX 3000')
})

test('Creating product without price should throw error',async()=>{
    try{
        const product = JSON.parse(JSON.stringify(dbfixtures.products.productTest))
        delete product.price
        await dbclient.productdb.createNewProduct(product)
    }catch(e){
        expect(e.message).toEqual('Enter a valid product cost')
    }
})

test('Creating product without stock as decimal should throw error',async()=>{
    try{
        const product = JSON.parse(JSON.stringify(dbfixtures.products.productTest))
        product.stock = 5.5
        await dbclient.productdb.createNewProduct(product)
    }catch(e){
        expect(e.message).toEqual('Stock cannot be a decimal value')
    }
})

test('Creating product without description should throw error',async()=>{
    try{
        const product = JSON.parse(JSON.stringify(dbfixtures.products.productTest))
        delete product.descriptionLong
        await dbclient.productdb.createNewProduct(product)
    }catch(e){
        expect(e.message).toEqual('Enter a valid product description')
    }
})

test('Creating product without category should throw error',async()=>{
    try{
        const product = JSON.parse(JSON.stringify(dbfixtures.products.productTest))
        delete product.category
        await dbclient.productdb.createNewProduct(product)
    }catch(e){
        expect(e.message).toEqual('Category cannot be empty')
    }
})

test('Creating product without subcategory should throw error',async()=>{
    try{
        const product = JSON.parse(JSON.stringify(dbfixtures.products.productTest))
        delete product.subCategory
        await dbclient.productdb.createNewProduct(product)
    }catch(e){
        expect(e.message).toEqual('Sub Category cannot be empty')
    }
})

test('Find a product with the given product ID',async()=>{
    const product = await dbclient.productdb.getExistingProduct(dbfixtures.products.productTest_2._id)
    expect(product.name).toEqual('Nvidia 4090 Ti')
})

test('Finding a product without proper Object ID should throw error',async()=>{
    try{
        await dbclient.productdb.getExistingProduct('sdfsdf')
    }catch(e){
        expect(e.message).toEqual('Product Id is invalid')
    }
})

test('Update a product with a product ID', async()=>{
    const product = JSON.parse(JSON.stringify(dbfixtures.products.productTest_2))
    product.price = 168000
    product.descriptionLong = 'The latest of the Nvidia series of graphics cards with RTX and 30x the RTX coures than previous generation with 24GB of video memory'
    const p = await dbclient.productdb.updateProduct(product)
    expect(p.price).toBe(168000)
})

test('Updating a product with invalid ID throws error', async()=>{
    try {
        const product = JSON.parse(JSON.stringify(dbfixtures.products.productTest_2))
        product._id = '6507194512d32679e46bf953'
        await dbclient.productdb.updateProduct(product)
    } catch (e) {
        expect(e.message).toBe('Product Id is invalid')
    }
})

test('Updating a product should run validators', async()=>{
    try {
        const product = JSON.parse(JSON.stringify(dbfixtures.products.productTest_2))
        product.descriptionLong = ''
        await dbclient.productdb.updateProduct(product)
    } catch (e) {
        expect(e.message).toBe('Enter a valid product description')
    }
})

test('Deletig a product with invalid Id throws error',async()=>{
    try{
        await dbclient.productdb.deleteProduct("sdsdsdsdsdxzc")
    }catch(e){
        expect(e.message).toBe('Product Id is invalid')
    }
})

test('Delete a product',async()=>{
    const product = await dbfixtures.products.saveMockProductTodelete()
    const mCount = await dbclient.productdb.deleteProduct(product._id)
    expect(mCount).toBe(true)
})

test('List products using page number nad page size along with filters',async()=>{
    const filter = {
        category:'Electronics'
    }
    const products = await dbclient.productdb.getProducts(filter,6,5)
    console.log(products)
})


