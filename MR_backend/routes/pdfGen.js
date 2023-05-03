const express = require('express');

const {genPdfUserAppointment} = require('../controllers/pdfGen');

const router = express.Router({mergeParams:true})

const {protect, authorize}  =require('../middleware/auth')

router.route('/users/:id').
    get(protect, authorize('admin', 'user'), genPdfUserAppointment)



