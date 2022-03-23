const path = require('path')
const Complaint = require('../models/Complaint')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/User')

// get all complaint
const complaints = asyncHandler(async(req, res, next) => {
    // find all customer
    // const complaints = await Complaint.find().populate({
    //     path: 'branch',
    //     select: 'name address'
    // })

    // // response
    // res.status(200).json({
    //     success: true,
    //     count: complaints.length,
    //     data: complaints
    // })

    // Adding pagination with advanceResult middleware
    res.status(200).json(res.advancedResult)
})

// get single complaint
const complaint = asyncHandler(async(req, res, next) => {
    const complaint = await Complaint.findById(req.params.id).populate({
        path: 'branch',
        select: 'name address'
    })

    // check for complaint
    if(!complaint) {
        return next(new ErrorResponse(`Coustomer not found with the id ${req.params.id}`, 404))
    }

    // response
    res.status(200).json({
        success: true,
        data: complaint
    })
})

// create customer
const addComplaint = asyncHandler(async(req, res, next) => {
    req.body.user = req.user.id

    // create customer
    const complaint = await Complaint.create(req.body)

    // response
    res.status(200).json({
        success: true,
        data: complaint
    })
})

// Update customer
const updateComplaint= asyncHandler(async(req, res, next) => {
    // find customer
    let complaint = await Complaint.findById(req.params.id)


    // check for customer
    if(!complaint) {
        return next(new ErrorResponse(`Customer not found with the id ${req.params.id}`, 404))
    }

    // check if the manager is the owner of the detail
    if(complaint.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`Customer with the id ${req.user.id} not allow to update this route`, 401))
    }

    // update complaint
    complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true

    })

     // response
     res.status(200).json({
        success: true,
        data: complaint
    })

}) 

// Update complaint
const deleteComplaint = asyncHandler(async(req, res, next) => {
    // find compalint
    let complaint = await Complaint.findById(req.params.id)


    // check for compalint
    if(!complaint) {
        return next(new ErrorResponse(`manager not found with the id ${req.params.id} `, 404))
    }

     // check if the customer is the owner of the detail
     if(complaint.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`manager with the id ${req.user.id} not allow to delete this route`, 401))
    }

    // delete customer
    complaint = await Complaint.findByIdAndDelete(req.params.id)

 

     // response
     res.status(200).json({
        success: true,
        data: {}
    })

})

module.exports = {
    complaints,
    complaint,
    addComplaint,
    updateComplaint,
    deleteComplaint
}