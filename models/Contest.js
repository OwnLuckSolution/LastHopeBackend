const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lotteryContestSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // startDate: {
  //   type: Date,
  //   required: true,
  // },
  // endDate: {
  //   type: Date,
  //   required: true,
  // },
  participants: [
    {
      type: String,
      ref: 'User',
    },
  ],
  isLive: {
    type: Boolean,
    default: true,
  },
  firstPrize: {
    type: String,
    default: 'No prize specified',
  },
  secondPrize: {
    type: String,
    default: 'No prize specified',
  },
  thirdPrize: {
    type: String,
    default: 'No prize specified',
  },
  images: [{
    type: String,
    required: true,
  }],
  description: {
    type: String,
    default: 'No description available',
  },
  price: {
    type: Number,
    default: 0,
  },
  winner1:{
    type: String,
    default: null,
  },
  winner2:{
    type: String,
    default: null,
  },
  winner3:{
    type: String,
    default: null,
  },
});

const Contest = mongoose.model('Contest', lotteryContestSchema);

module.exports = Contest;
