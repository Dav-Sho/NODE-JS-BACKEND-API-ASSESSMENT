const User = require('../models/User')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/asyncHandler')

// Register
const register = asyncHandler(async(req, res, next) => {
    const {name, email, password} = req.body

    // find user
    let user = await User.findOne({email})

    // check if user exist
    if(user) {
        return next(new ErrorResponse('User already exist', 400))
    }

    user = await User.create({
        name,
        email,
        password
    })

    // call cookie
    sendCookie(user, res, 200)
})

// login user
const login = asyncHandler(async(req, res, next) => {
    const {email, password} = req.body

    // check email & password
    if(!email || !password) {
        return next(new ErrorResponse('Email and Password is required', 400))
    }

    const user = await User.findOne({email}).select('+password')

    // check user
    if(!user) {
        return next(new ErrorResponse('Invalid User', 400))
    }

    // compare password
    const isMatch = await user.comparePassword(password) 

    // check password
    if(!isMatch) {
        return next(new ErrorResponse('Invalid password', 400))
    }

    // call cookie
    sendCookie(user, res, 200)
})

const sendCookie = (user, res, statusCode) => {

    // generate token
    const token = user.getJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 )  , 
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
}

const getMe = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})

module.exports = {
    register,
    login,
    getMe
}