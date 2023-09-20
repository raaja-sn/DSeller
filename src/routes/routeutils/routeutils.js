const getErrorObject = (code,message)=>{
    return{
        code,
        message
    }
}

/**
 * Parse the Express error
 * @param {Error} e The error object to parse
 * @returns The object with error code and error message 
 */
const getError = (message)=>{
    return getErrorObject(2,message)
}

module.exports = {
    getError
}