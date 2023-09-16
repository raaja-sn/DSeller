
const getErrorObject = (code,message)=>{
    return{
        code,
        message
    }
}

const customErrorTag = 'CustomError'

const getErrorMessage = (e,model)=>{
    if(e.name === 'MongoServerError'){
        if(e.code == 11000){
            return getErrorObject(2,`${model} already exists`)
        }
        return getErrorObject(2,'Internal Server Error')
    }
    if(e.name === 'ValidationError'){
        for(let k of Object.keys(e.errors)){
            return getErrorObject(2,e.errors[k].message)
        }
    }
    if(e.name == 'CustomError'){
        return getErrorObject(2,e.message)
    }
    return getErrorObject(2,'Internal Server Error')
}

module.exports = {
    getErrorMessage,
    customErrorTag
}