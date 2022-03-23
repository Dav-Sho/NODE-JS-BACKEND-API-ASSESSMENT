const express = require('express')
const {complaints, complaint, addComplaint, updateComplaint, deleteComplaint} = require('../controllers/complaint')
const {protect, authorize} = require('../middleware/auth')
const Complaint = require('../models/Complaint')
const advancedResult = require('../middleware/advancedResult')
const router = express.Router()

router.route('/').get(advancedResult(Complaint, {
        path: 'branch',
        select: 'name address'
}),complaints)
router.route('/:id').get(complaint)
router.route('/').post(protect, addComplaint)
router.route('/:id').put(protect,  updateComplaint)
router.route('/:id').delete(protect, deleteComplaint)

module.exports = router