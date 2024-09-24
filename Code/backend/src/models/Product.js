const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['smartphone', 'laptop', 'smartwatch'],
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Enforce non-negative quantity
  },
  discount: {
    type: Number, // percentage
    default: 0,
    min: 0,
    max: 100,
  },
  images: {
    type: [String],
    required: true,
    // validate: { // Validate image URLs (optional)
    //   validator: (images) => images.every((url) => url.startsWith('https://')),
    //   message: 'Image URLs must start with "https://".',
    // },
  },
  description: {
    type: String,
  },
  specifications: {
    type: mongoose.Schema.Types.Mixed,
    of: {
      display: { type: String },
      processor: { type: String },
      memory: { type: String },
      storage: { type: String },
      frontCamera:  { type: String },
      rearCamera:  { type: String },
      battery: { type: String },
      operatingSystem: { type: String },
      wifi:  { type: String },
      bluetooth:  { type: String }
    },
  },
  availability: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    of: {
      inStock: { type: Boolean, required: true },
      quantity: { type: Number, min: 0 },
    },
  },
  colors: {
    type: [String],
  },
  warrenty: {type: String},
  releaseYear: {type: String},

  isFeatured: {
    type: Boolean,
    default: false
  },
  status:{
    type: String,
    enum: ['active', 'deleted'],
    default: 'active'
  },
  createdBy: {
    type: String,
    ref: 'User',
  },
  soldCount: { 
    type: Number, 
    default: 0 
  },
  updatedAt:{type: Date},
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

productSchema.index(
  { name: "text", brand: 'text', description: "text" }
);

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);