const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder')

const CustomerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
    },
    address: {
        type: String,
        required: [true, 'Customer address is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please use a valid email']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            // required: true
        },
        coordinate: {
            type: [Number],
            index: '2dsphere',
            // required: true
        },
        state: String,
        street: String,
        country: String,
        formmatedAddress: String,
        zipcode: String
    },
    photo:{
        type: String,
        default: 'photo.jpg'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

CustomerSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address)
    this.location = {
        type: 'Point',
        coordinate: [loc[0].longitude, loc[0].latitude],
        street: loc[0].streetName,
        state: loc[0].stateCode,
        country: loc[0].countryCode,
        formmatedAddress: loc[0].formattedAddress,
        zipcode: loc[0].zipcode
    }
    // this.address = undefined
    next()
})

module.exports = mongoose.model('Customer', CustomerSchema)