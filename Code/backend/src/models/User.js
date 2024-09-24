const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status:{
    type: String,
    enum: ['active', 'deleted'],
    default: 'active'
  },
  billingInfo: {
    fullName: String,
    phoneNumber: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  paymentInfo: {
    cardNumber: String,
    nameInCard: String,
    expiryDate: String,
    cvv: String
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
