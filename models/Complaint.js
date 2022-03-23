const mongoose = require('mongoose')
const ComplaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'First name is required'],
    },
    message: {
        type: String,
        required: [true, 'Last name is required'],
    },
    reviewed: {
        type: Boolean,
        required: false,
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
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Conplaint', ComplaintSchema)