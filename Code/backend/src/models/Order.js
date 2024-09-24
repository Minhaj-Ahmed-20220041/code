const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const orderSchema = new mongoose.Schema({
  orderBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderStatus: { type: String, enum: ['pending', 'order_placed', 'shipped', 'delivered'], default: 'pending' },
  paymentStatus: { type: String, enum: ['paid', 'failed'], default: 'failed' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    orderQuantity: Number,
    orderPrice: Number,
  }],
  shippingInfo: {
    fullName: String,
    phoneNumber: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  subTotal: Number,
  shippingCharge: Number,
  grandTotal: Number,
  status:{
    type: String,
    enum: ['active', 'deleted'],
    default: 'active'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt:{type: Date},
});

orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
