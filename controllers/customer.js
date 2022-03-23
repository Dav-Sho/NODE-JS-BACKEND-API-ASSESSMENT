const path = require('path')
const Customer = require('../models/Customer')
const ErrorResponse = require('../utils/ErrorResponse')
const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/User')

// get all customers
const customers = asyncHandler(async(req, res, next) => {
    // find all customer
    // const customers = await Customer.find().populate({
    //     path: 'branch',
    //     select: 'name address'
    // })

    // // response
    // res.status(200).json({
    //     success: true,
    //     count: customers.length,
    //     data: customers
    // })

    // Adding pagination with advanceResult middleware
    res.status(200).json(res.advancedResult)
})

// get single customer
const customer = asyncHandler(async(req, res, next) => {
    const customer = await Customer.findById(req.params.id).populate({
        path: 'branch',
        select: 'name address'
    })

    // check for customer
    if(!customer) {
        return next(new ErrorResponse(`Manager not found with the id ${req.params.id}`, 404))
    }

    // response
    res.status(200).json({
        success: true,
        data: customer
    })
})

// create customer
const addCustomer = asyncHandler(async(req, res, next) => {
    req.body.user = req.user.id

    // create customer
    const customer = await Customer.create(req.body)

    // response
    res.status(200).json({
        success: true,
        data: customer
    })
})

// Update customer
const updateCustomer = asyncHandler(async(req, res, next) => {
    // find customer
    let customer = await Customer.findById(req.params.id)


    // check for customer
    if(!customer) {
        return next(new ErrorResponse(`manager not found with the id ${req.params.id}`, 404))
    }

    // check if the manager is the owner of the detail
    if(customer.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`manager with the id ${req.user.id} not allow to update this route`, 401))
    }

    // update customer
    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true

    })

     // response
     res.status(200).json({
        success: true,
        data: customer
    })

}) 

// Update customer
const deleteCustomer = asyncHandler(async(req, res, next) => {
    // find customer
    let customer = await Customer.findById(req.params.id)


    // check for customer
    if(!customer) {
        return next(new ErrorResponse(`manager not found with the id ${req.params.id} `, 404))
    }

     // check if the customer is the owner of the detail
     if(customer.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`manager with the id ${req.user.id} not allow to delete this route`, 401))
    }

    // delete customer
    customer = await Customer.findByIdAndDelete(req.params.id)

 

     // response
     res.status(200).json({
        success: true,
        data: {}
    })

})

const customerPhoto = asyncHandler(async(req, res, next) => {
     // find customer
     let customer = await Customer.findById(req.params.id)


     // check for customer
     if(!customer) {
         return next(new ErrorResponse(`manager not found with the id ${req.params.id}`, 404))
     }
 
     // check if the manager is the owner of the detail
     if(customer.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`manager with the id ${req.user.id} not allow to update this route`, 401))
     }

    //  check if user upload file
     if(!req.files) {
        return next(new ErrorResponse('Please upload a file', 400))
     }

     const file = req.files.file

    //  check if user upload photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Please upload image', 400))
    }

    // check photo size
    if(file.size > process.env.PHOTO_PAT) {
        return next(new ErrorResponse(`Please upload image less than ${process.env.PHOTO_PATH}`, 400))
    }

    console.log(req.files);

// filename
    file.name = `photo_${customer._id}${path.parse(file.name).ext}`

    console.log(file.name);

    // save photo to public folder
    file.mv(`${process.env.PHOTO_PATH}/${file.name}`, async(err) => {
        if(err){
            console.error(err.message);
            return next(new ErrorResponse('Problem uploading photo', 500))
        }

        // response
        res.status(200).json({
            success: true,
            data: file.name
        })
    })
     
 
})

module.exports = {
    customers,
    customer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    customerPhoto
}