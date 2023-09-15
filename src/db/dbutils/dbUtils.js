
const getErrorMessage = (e,model)=>{
    if(e.name === 'MongoServerError'){
        if(e.code == 11000){
            return `${model} already exists`
        }
        return 'Internal Server Error'
    }
    if(e.name === 'ValidationError'){
        for(let k of Object.keys(e.errors)){
            return e.errors[k].message
        }
    }
    return 'Internal Server Error'
}

module.exports = {
    getErrorMessage
}