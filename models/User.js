const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nanem is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please use a valid email']
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 or more characters'],
        select: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

// Encrypt password
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// jw token
UserSchema.methods.getJwtToken = function() {
    return jwt.sign({id: this.id}, process.env.JWT_SECRETE, {
        expiresIn: process.env.JWT_EXPIRES
    })
}

// compare password
UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', UserSchema)