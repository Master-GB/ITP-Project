const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Donor', 'Delivary Volunteer', 'Volunteer', 'PartnerShip','Admin'],
        required: true,
        default:'Doner'
    },
    contactNumber: {
        type: Number,
        required: true,
    },
    
    address: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('UserModel', userSchema);