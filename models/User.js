const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    balance: {
        type: Number,
        default: 0
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction'
        }
    ]
});

const transactionSchema = new mongoose.Schema({
    amount: Number,
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required: true,
    },
    isVerfied:{
        type: Boolean,
        required: true,
        default: true,
    },
    type:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        default: "Approved",
    },
    paymentMehtod:{
        type: String,
        required: true,
        default:"Cash idk",
    }
});

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
        type: Boolean,
        default: false,
    },
    referredBy: String,
    referralCode: String,
    verified:{
        type: Boolean,
        default: false,
    },
    verificationCode: String,
    verificationCodeExpires: Date,
    purchases: [
        {
            productName: String,
            price: Number,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    wallet: {
        type: walletSchema,
        default: {}
    }
});

const Wallet = mongoose.model('Wallet', walletSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const User = mongoose.model('User', userSchema);

module.exports = { User, Wallet, Transaction };
