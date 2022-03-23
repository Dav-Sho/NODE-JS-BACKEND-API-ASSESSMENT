const Manager = require('../models/Manager')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/User')

// get all manager
const managers = asyncHandler(async(req, res, next) => {
    // find all manager
    // const managers = await Manager.find().populate({
    //     path: 'branch',
    //     select: 'name address'
    // })

    // // response
    // res.status(200).json({
    //     success: true,
    //     count: managers.length,
    //     data: managers
    // })
    // Adding pagination with advanceResult middleware
    res.status(200).json(res.advancedResult)
})

// get single Manager
const manager = asyncHandler(async(req, res, next) => {
    // find manager
    const manager = await Manager.findById(req.params.id).populate({
        path: 'branch',
        select: 'name address'
    })

    // check for manager
    if(!manager) {
        return next(new ErrorResponse(`Manager not found with the id ${req.params.id}`, 404))
    }

    // response
    res.status(200).json({
        success: true,
        data: manager
    })
})

// create manager
const addManager = asyncHandler(async(req, res, next) => {
    req.body.user = req.user.id

    // create manager 
    const manager = await Manager.create(req.body)

    // response
    res.status(200).json({
        success: true,
        data: manager
    })
})

// Update manager
const updateManager = asyncHandler(async(req, res, next) => {
    // find manager
    let manager = await Manager.findById(req.params.id)


    // check for manager
    if(!manager) {
        return next(new ErrorResponse(`manager not found with the id ${req.params.id}`, 404))
    }

    // check if the manager is the owner of the detail
    if(manager.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`manager with the id ${req.user.id} not allow to update this route`, 401))
    }

    // update manager
    branch = await Manager.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true

    })

     // response
     res.status(200).json({
        success: true,
        data: branch
    })

}) 

// Update delete
const deleteManager = asyncHandler(async(req, res, next) => {
    // find manager
    let manager = await Manager.findById(req.params.id)


    // check for manager
    if(!manager) {
        return next(new ErrorResponse(`manager not found with the id ${req.params.id} `, 404))
    }

     // check if the manager is the owner of the detail
     if(manager.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`manager with the id ${req.user.id} not allow to delete this route`, 401))
    }

    // delete manager
    manager = await Manager.findByIdAndDelete(req.params.id)

 

     // response
     res.status(200).json({
        success: true,
        data: {}
    })

}) 

module.exports = {
    managers,
    addManager,
    manager,
    updateManager,
    deleteManager
}