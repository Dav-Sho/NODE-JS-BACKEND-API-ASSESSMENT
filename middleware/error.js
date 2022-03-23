const ErrorResponse = require('../utils/ErrorResponse')
const ErrorHandler = (err, req, res, next) => {
    console.log(err.message)
    // duplicate err
    let error = {...err}

    error.message = err.message

    if(err.name === 'CastError') {
        const message = `Resource not found with the id ${err.value}`
        error = new ErrorResponse(message, 400)
    }
    
    if(err.code === 11000) {
        const message = 'Duplicate key enterd'
        error = new ErrorResponse(message, 400)
    }

    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    res.status(400).json({
        success: false,
        error: error.message
    })

}

module.exports = ErrorHandler