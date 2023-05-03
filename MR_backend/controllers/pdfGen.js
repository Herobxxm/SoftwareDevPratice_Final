const Appointment = require('../models/Reservation');

//@desc get appointment  for user
//@route GET /api/genpdf/users/:id


exports.genPdfUserAppointment = async (req, res, next) =>{

    try {
        const appointments = await Appointment.find({user: req.params.id})

        console.log(appointments)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success:false,
            message: "Cannot find generate appointment for user"
        })

    }


}


