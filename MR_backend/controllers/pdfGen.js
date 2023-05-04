const Appointment = require('../models/Reservation');
const User = require('../models/User')
const MassageShop = require('../models/MassageShop')
const moment = require('moment');
var jsPDF = require('jspdf');
require('jspdf-autotable');


const genPdf = async (columnNames, rowValues, DisplayTopic) => {
    const doc = new jsPDF.jsPDF();
    //////////////////////////////////////////////////////////////////////
    doc.setFontSize(24);
    doc.text("Massage Shop Report",60,10)
    doc.text("----------------------------------------------------------------------------------",0,15)
    doc.setFontSize(16);
    doc.text("This report issue at  " + new Date().toLocaleString(),10,25)
    doc.text(`${DisplayTopic}`,10,32)
    // Create a new jsPDF instance
    doc.autoTable(columnNames, rowValues, {startY: 40,})
    return Buffer.from(doc.output())


}

//@desc get appointment  for user
//@route GET /api/v1/genPdf/users/:id


exports.genPdfUserAppointment = async (req, res, next) =>{

    try {

        var userSearchId;
        let disPlayUser = "user : ";
        if (req.user.role === 'admin'){
            userSearchId = req.params.id
            console.log("userId is " + userSearchId)
            let queryRes = await User.findById(userSearchId)
            if (!queryRes){
                res.status(404).json({
                    success: false,
                    message: "there is no this userId that you need"
                })
                return
            }

            disPlayUser += queryRes.name
        }else if (req.user.role === 'user'){
            userSearchId = req.user._id
            disPlayUser  += req.user.name
        }else{
            res.status(404).json({
                success: false,
                message: "can't generate report due to invalid role accessing"
            })
        }


        // generate querying
        const results = await Appointment.find({user: userSearchId})
                    .populate("user")
                    .populate('massageShop')
                    .sort({apptDate: 1})
                    .exec()
        let dataRows = []
        dataRows = results.map( appt => [moment(appt.apptDate).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                                         moment(appt.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                                         appt.massageShop.name,
                                         appt.massageShop.tel || "n/a"])

        ////// prepare data to generate pdf and send back to user
        let columnNames = ["Appointment Date", "Create Date","ShopName","Tel"];

        res.contentType('application/pdf');
        res.send(await genPdf(columnNames, dataRows, disPlayUser));
        res.status(200)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success:false,
            message: "Cannot find generate appointment for user"
        })

    }


}


//@desc get appointment  for user
//@route GET /api/v1/genPdf/massageShops/:id

exports.genPdfMassageAppointment = async (req, res, next) => {

    try {

        var shopSearchId = req.params.id;


        /// get data of the massage shop
        const shopQ = await MassageShop.findById(shopSearchId)
        if (!shopQ) {
            res.status(404).json({
                success: true,
                message: "there is no massage shop to generate report"
            })
            return
        }
        let disPlayShop = `massageShop name : ${shopQ.name}   ====>    tel : ${shopQ.tel || "n/a"}`;


        // generate querying
        const results = await Appointment.find({massageShop: shopSearchId})
            .populate("user")
            .sort({apptDate: 1})
            .exec()
        let dataRows = []
        dataRows = results.map( appt => [moment(appt.apptDate).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                                         moment(appt.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                                         appt.user.name,
                                         appt.user.tel || "n/a",
                                         appt.user.email
                                        ]
                                         )

        ////// prepare data to generate pdf and send back to user
        let columnNames = ["Appointment Date", "Create Date","customerName","customerTel", "customerEmail"];

        res.contentType('application/pdf');
        res.send(await genPdf(columnNames, dataRows, disPlayShop));
        res.status(200)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success:false,
            message: "Cannot find generate appointment for user"
        })

    }


}