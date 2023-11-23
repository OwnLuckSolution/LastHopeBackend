const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  salePrice:{
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  winner: {
    type: String,
    default: null,
  },
  images:[{
    type: String,
    required: true,
  }],
  participants:[{
    type: String,
    required: false,
  }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
