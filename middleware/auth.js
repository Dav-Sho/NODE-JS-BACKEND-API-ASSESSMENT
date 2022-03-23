const asyncHandler = require('./asyncHandler')
const ErrorResponse = require('../utils/ErrorResponse')
const user = require('../models/User')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = asyncHandler(async(req, res, next) => {
    let token;

    // check header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    // check token
    if(!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETE)
        req.user = await User.findById(decoded.id)
        next()
    } catch (err) {
        console.error(err.message);
        return next(new ErrorResponse('Invalid token', 400))
    }
})

// admin authorization 
const authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User with the role ${req.user.role} is not allow to acces this route`, 400))
        }
        next()
    }
}

module.exports = {
    protect,
    authorize
}