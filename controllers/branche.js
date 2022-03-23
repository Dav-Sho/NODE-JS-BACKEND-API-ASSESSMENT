const Branch = require('../models/Branch')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/User')

// get all Branches
const branches = asyncHandler(async(req, res, next) => {
    // find all branch
    // const branches = await Branch.find()

    // // response
    // res.status(200).json({
    //     success: true,
    //     count: branches.length,
    //     data: branches
    // })

    // pagination with advanceResult middleware
    res.status(200).json(res.advancedResult)
})

// get single Branche
const branche = asyncHandler(async(req, res, next) => {
    const branche = await Branch.findById(req.params.id)

    // check for branch
    if(!branche) {
        return next(new ErrorResponse(`Branche not found with the id ${req.params.id}`, 404))
    }

    // response
    res.status(200).json({
        success: true,
        data: branche
    })
})

const addBranche = asyncHandler(async(req, res, next) => {
    
    // create branch by admin
    const branche = await Branch.create(req.body)

    // response
    res.status(200).json({
        success: true,
        data: branche
    })
})

// Update branch by Admin
const updateBranch = asyncHandler(async(req, res, next) => {
    // find branch
    let branch = await Branch.findById(req.params.id)


    // check for branch
    if(!branche) {
        return next(new ErrorResponse(`Branche not found with the id ${req.params.id}`, 404))
    }

    // update Branch
    branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true

    })

     // response
     res.status(200).json({
        success: true,
        data: branch
    })

}) 

// Update branch by Admin
const deleteBranch = asyncHandler(async(req, res, next) => {
    // find branch
    let branch = await Branch.findById(req.params.id)


    // check for branch
    if(!branche) {
        return next(new ErrorResponse(`Branche not found with the id ${req.params.id}`, 404))
    }

    // delete Branch
    branch = await Branch.findByIdAndDelete(req.params.id)

 

     // response
     res.status(200).json({
        success: true,
        data: {}
    })

}) 

module.exports = {
    branches,
    addBranche,
    branche,
    updateBranch,
    deleteBranch
}