const Category = require('./category')
const mongoode = require('mongoose')
const dbUtils = require('../../db/dbutils/dbUtils')
const { default: mongoose } = require('mongoose')

/**
 * Create new product category
 * @param category Object following the Category schema
 * @returns The newly created category
 */
const createCategory = async(category) =>{
    try{
        return await new Category(category).save()
    }catch(e){
        throw(dbUtils.getErrorMessage(e,'Category'))
    }
}

/**
 * Add Category image Url or Id
 * @param name Name of the category to update
 * @param imgStr The url or id of the category image
 * @returns Updated Category
 */
const updateCategoryImage = async(name,imgStr) =>{
    try{
        return await new Category().updateImage(name,imgStr)
    }catch(e){
        throw(dbUtils.getErrorMessage(e,'Category'))
    }
}

/**
 * Add sub categories to a category
 * @param name Name of the category to update
 * @param subcategories An Array of strings
 * @returns Updated Category
 */
const addSubCategories = async(name,subcategories) =>{
    try{
        return await new Category().addSubCategories(name,subcategories)
    }catch(e){
        throw(dbUtils.getErrorMessage(e,'Category'))
    }
}

const getCategories = async()=>{
    try{
        return await Category.find({}).select('name subCategories image -_id')
        .limit(100)
    }catch(e){
        throw(dbUtils.getErrorMessage(e,'Category'))
    }
}

module.exports = {
    createCategory,
    updateCategoryImage,
    addSubCategories,
    getCategories
}