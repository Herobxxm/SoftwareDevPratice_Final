const mongoose = require('mongoose');

const massageShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address'],
    },
    district: {
        type: String,
        required: [true, 'Please add a district'],
    },
    province: {
        type: String,
        required: [true, 'Please add a province'],
    },
    postalcode: {
        type: String,
        required: [true, 'Please add a postal code'],
        maxlength: [5, 'Postal code can not be more than 5 characters']
    },
    tel:    {
        type: String,
    },
    region: {
        type: String,
        required: [true, 'Please add a region'],
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        require: true,
        ref: 'User',
        required: true
    },
    verify: {
        type: Boolean,
        default: false,
        require: true
    },


},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Cascade delete appointments when a hospital is deleted
massageShopSchema.pre('remove', async function(next) {
    console.log(`Appointments being removed from massageShop ${this._id}`);
    await this.model('Appointment').deleteMany({ massageShop: this._id });
    next();
});


// Reverse populate with virtuals
massageShopSchema.virtual('appointments', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'massageShop',
    justOne: false
});

module.exports = mongoose.model('MassageShop', massageShopSchema);