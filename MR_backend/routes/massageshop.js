const express = require('express');

const {getMassageShops,getMassageShop,createMassageShop,updateMassageShop,verifyMassageShop,deleteMassageShop} = require('../controllers/massageshop')

//Include other resource routers
const appointmentRouter = require('./reservation');

const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:massageShopId/appointments',appointmentRouter);

router.route('/').get(getMassageShops).post(protect,authorize('admin','massage_owner'), createMassageShop);
router.route('/:id/verify').put(protect,authorize('admin'),verifyMassageShop);
router.route('/:id').get(getMassageShop).put(protect,authorize('admin','massage_owner'), updateMassageShop).delete(protect,authorize('admin','massage_owner'),deleteMassageShop);

module.exports = router;

/**
  * @swagger
  * components:
  *   schemas:
  *     Hospital:
  *       type: object
  *       required:
  *         - name
  *         - address
  *       properties:
  *         id:
  *           type: string
  *           format: uuid
  *           description: The auto-generated id of the hospital
  *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
  *         ลําดับ:
  *           type: string
  *           description: Ordinal number
  *         name:
  *           type: string
  *           description: Hospital name
  *         address:
  *           type: string
  *           description: House No., Street, Road
  *         district:
  *           type: string
  *           description: District
  *         province:
  *           type: string
  *           description: province
  *         postalcode:
  *           type: string
  *           description: 5-digit postal code
  *         tel:
  *           type: string
  *           description: telephone number
  *         region:
  *           type: string
  *           description: region
  *       example:
  *         id: 609bda561452242d88d36e37
  *         ลําดับ: 121
  *         name: Happy Hospital
  *         address: 121 ถ.สุขุมวิท
  *         district: บางนา
  *         province: กรุงเทพมหานคร
  *         postalcode: 10110
  *         tel: 02-2187000
  *         region: กรุงเทพมหานคร (Bangkok)
  */



/**
  * @swagger
  * tags:
  *   name: Hospitals
  *   description: The hospitals managing API
  */

/**
  * @swagger
  * /hospitals:
  *   get:
  *     summary: Returns the list of all the hospitals
  *     tags: [Hospitals]
  *     responses:
  *       200:
  *         description: The list of the hospitals
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Hospital'
  */

/**
  * @swagger
  * /hospitals/{id}:
  *   get:
  *     summary: Get the hospital by id
  *     tags: [Hospitals]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The hospital id
  *     responses:
  *       200:
  *         description: The hospital description by id
  *         contents:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Hospital'
  *       404:
  *         description: The hospital was not found
  */

/**
  * @swagger
  * /hospitals:
  *   post:
  *     summary: Create a new hospital
  *     tags: [Hospitals]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Hospital'
  *     responses:
  *       201:
  *         description: The hospital was successfully created
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Hospital'
  *       500:
  *         description: Some server error
*/

/**
  * @swagger
  * /hospitals/{id}:
  *   put:
  *     summary: Update the hospital by the id
  *     tags: [Hospitals]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The hospital id
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Hospital'
  *     responses:
  *       200:
  *         description: The hospital was updated
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Hospital'
  *       404:
  *         description: The hospital was not found
  *       500:
  *         description: Some error happened
  */

/**
  * @swagger
  * /hospitals/{id}:
  *   delete:
  *     summary: Remove the hospital by id
  *     tags: [Hospitals]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The hospital id
  *
  *     responses:
  *       200:
  *         description: The hospital was deleted
  *       404:
  *         description: The hospital was not found
  */