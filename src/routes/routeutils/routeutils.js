const getErrorObject = (code,message)=>{
    return{
        code,
        message
    }
}

/**
 * Returns an error object for express response
 * @param {String} message The error message
 * @returns The object with error code and error message 
 */
const getError = (message)=>{
    return getErrorObject(2,message)
}

module.exports = {
    getError
}