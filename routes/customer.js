const express = require('express')
const {customers, customer, addCustomer, updateCustomer, deleteCustomer, customerPhoto} = require('../controllers/customer')
const {protect, authorize} = require('../middleware/auth')
const Customer = require('../models/Customer')
const advancedResult = require('../middleware/advancedResult')
const router = express.Router()

router.route('/').get(advancedResult(Customer, {
    path: 'branch',
    select: 'name address'
}),customers)
router.route('/:id').get(customer)
router.route('/').post(protect, addCustomer)
router.route('/:id').put(protect,  updateCustomer)
router.route('/:id').delete(protect, deleteCustomer)
router.route('/photo/:id').put(protect, customerPhoto)

module.exports = router