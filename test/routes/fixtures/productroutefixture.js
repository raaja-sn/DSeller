const Product = require('../../../src/product/productdb/product')

const setUpDatabase = async()=>{
    await Product.deleteMany({})
    for(let i=1; i<= 100; i++){
        await Product(getMockProduct(i)).save()
    }
}

const getMockProduct = (i)=>{
    const n = Math.floor(Math.random()*names.length)
    const c = Math.floor(Math.random()*category.length)
    const s = Math.floor(Math.random()*sub.length)

    return {
        name:`${names[n]} ${i}`,
        category:category[c],
        subCategory:sub[c][s],
        descriptionLong:'Mock Description',
        price:50
    }
}

const names = [
    'Mary Mackay','Dan Oliver','Abigail Slater'
] 

const category = [
    'Electronics','Clothing'
]

const sub = [
    [
        'Mobiles',
        'PC'
    ],
    [
        'TShirt',
        'Shoes'
    ]
]

let testProductId

module.exports = {
    setUpDatabase,
    testProductId
}