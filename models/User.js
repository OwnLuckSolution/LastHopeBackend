const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    isAdmin:{
        type: String,
        default: false,
    },
    myReferralCode: String,
    referralCode: String,
    verified:{
        type: Boolean,
        default: false,
    },
    verificationCode: String,
    verificationCodeExpires: Date,
    purchases: [
        {
            //need to customise a bit
            productName: String,
            price: Number,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});
const User = mongoose.model('User', userSchema);

module.exports = User;
