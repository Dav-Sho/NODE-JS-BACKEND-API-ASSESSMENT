const express = require('express')
const {branches, addBranche, branche, updateBranch, deleteBranch} = require('../controllers/branche')
const {protect, authorize} = require('../middleware/auth')
const advancedResult = require('../middleware/advancedResult')
const Branch = require('../models/Branch')
const router = express.Router()

router.route('/').get(advancedResult(Branch), branches)
router.route('/:id').get(branche)
router.route('/').post(protect, authorize('admin'), addBranche)
router.route('/:id').put(protect, authorize('admin'), updateBranch)
router.route('/:id').delete(protect, authorize('admin'), deleteBranch)

module.exports = router