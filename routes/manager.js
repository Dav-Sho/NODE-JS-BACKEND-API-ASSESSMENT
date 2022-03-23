const express = require('express')
const {managers, manager, addManager, updateManager, deleteManager} = require('../controllers/manager')
const {protect, authorize} = require('../middleware/auth')
const Manager = require('../models/Manager')
const advancedResult = require('../middleware/advancedResult')
const router = express.Router()

router.route('/').get(advancedResult(Manager,{
    path: 'branch',
    select: 'name address'
}),managers)
router.route('/:id').get(manager)
router.route('/').post(protect, addManager)
router.route('/:id').put(protect,  updateManager)
router.route('/:id').delete(protect, deleteManager)

module.exports = router