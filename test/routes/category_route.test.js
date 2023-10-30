const request = require('supertest')
const app = require('../../src/app')
const db = require('../../src/category/categorydb/category')

const getCategory = (i)=>{
    return {
        name:`Electronics ${i}`,
        subCategories:['Mobiles']
    }
}
beforeAll(async()=>{
    await db.deleteMany({})
    for(let i=1; i<=120 ;i++){
        await new db(getCategory(i)).save()
    }
})

test(`Add new category`,async()=>{
    const resp = await request(app).post('/category').send({
        name:'Electronics',
        subCategories: ['Mobiles','Laptops','Headphones']
    }).expect(201)
})


test(`Update subcategories`,async()=>{
    const resp = await request(app).patch(`/category/Electronics`).send({
        subCategories: ['Tablets','Gaming Consoles']
    }).expect(200)
    console.log(resp.body)
})

test('Get categories',async()=>{
    const resp = await request(app).get('/category')
    .expect(200)
    console.log(resp.body)
})