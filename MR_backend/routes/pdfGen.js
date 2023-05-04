const express = require('express');

const {genPdfUserAppointment, genPdfMassageAppointment} = require('../controllers/pdfGen');

const router = express.Router({mergeParams:true})

const {protect, authorize}  =require('../middleware/auth')

router.route('/users/:id').
    get(protect, authorize('admin'), genPdfUserAppointment)

router.route('/users/').
    get(protect, authorize('user'), genPdfUserAppointment)

router.route('/massageShops/:id').
    get(protect, authorize('admin'), genPdfMassageAppointment)


module.exports = router


