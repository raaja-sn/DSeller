const dbclient = require('../../src/db/dbclient')
const Product = require('../../src/product/productdb/product')

const productTest = {
    name:'HyperX 3000',
    category: 'Electronics',
    subCategory: 'Headphones',
    stock:50,
    price:3000,
    shippingCost:200,
    descriptionLong: "HyperX gaming headset series 3000. superior drives with active noice cancellation."
}

const mockProduct = {
    name:'Nvidia 4090 Ti ',
    category: 'Electronics',
    subCategory: 'Graphics Card',
    stock:50,
    price:160000,
    shippingCost:400,
    descriptionLong: "The latest of the Nvidia series of graphics cards with RTX and 30X the RTX coures than previous generation"
}

const mockProductToDelete = {
    name:'Indian Terrain T-Shirt',
    category: 'Clothings',
    subCategory: 'Mens Clothing',
    stock:50,
    price:1430,
    shippingCost:200,
    descriptionLong: "A sea blue T-shirt made of cotton"
}

const categories = [
    'Electronics',
    'Clothing',
    'Groceries',
    'Home Decors'
]

const getMockProduct = (i)=>{
    return {
        name:`Mock Product ${i}`,
        category: `${getCategory()}`,
        subCategory: 'Sub',
        stock:50,
        price:500,
        shippingCost:200,
        descriptionLong: "Mock Description"
    }
}

let productTest_2
const setUpDatabase = async()=>{
    await Product.deleteMany({})   
    for(let i=1; i<=100; i++ ){
       // await new Product(getMockProduct(i)).save()
    }
    return await new Product(mockProduct).save()
}

const getCategory = () =>{
    return categories[Math.floor(Math.random()*4)]
}

const saveMockProductTodelete = async()=>{
    return await new Product(mockProductToDelete).save()
}

module.exports = {
    productTest,
    productTest_2,
    saveMockProductTodelete,
    setUpDatabase
}