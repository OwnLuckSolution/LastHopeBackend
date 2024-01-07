const mongoose = require('mongoose');


const investmentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['A', 'B'], 
        required: true,
    },
    initialAmount: {
        type: Number,
        required: true,
    },
    totalReturn: {
        type: Number,
        default: 0,
    },
    isActive:{
        type:Boolean,
        required: true,
        default: true,
    },
    user:{
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdate:{
        type: Date,
        default: Date.now,
    },
    dailyIncome:{
        type: Number,
        default: 0,
    },
    lastWithdrawal:{
        type: Date,
        default: Date.now(),
    },
    monthIncome:{
        type: Number,
        default: 0,
    }
});
const walletSchema = new mongoose.Schema({
    balance: {
        type: Number,
        default: 0
    },
    totalCommission:{
        type:Number,
        default : 0
    },
    commission1:{
        type:Number,
        default : 0
    },
    commission2:{
        type:Number,
        default : 0
    },
    commission3:{
        type:Number,
        default : 0
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
        default:"Wallet",
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
    image:{
        type: String,
        required: false,
    },
    number: {
        type: String,
        required: true
    },
    googleId:{
        type: String,
        default:false,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    token:{
        type:String,
        default: null,
    },
    referredBy: String,
    referralCode: String,
    verified:{
        type: Boolean,
        default: false,
    },
    tempOTP: {
        type: String,
        default: null,
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
    investments: [investmentSchema],
    wallet: {
        type: walletSchema,
        default: {}
    },
});



const Wallet = mongoose.model('Wallet', walletSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const User = mongoose.model('User', userSchema);
const Investment = mongoose.model('Investment',investmentSchema)

module.exports = { User, Wallet, Transaction,Investment};
