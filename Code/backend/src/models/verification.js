const mongoose = require('mongoose');

const verificaitonSchema = mongoose.Schema({
    userId: { 
        type: String,
        require: true
    },
    email: { 
        type: String,
        require: true
    },
    case: {
        type: String,
        enum: ['password_reset_verification', 'user_verification'],
        require: true
    },
    requestedOn: {
        type: Date,
        default: Date.now,
    },
    code: {
        type: String,
    },
    isCodeConsumed: { 
        type: Boolean,
        default: false
    },
    codeExpiration:{
        type: Date,
    },
    token: {
        type: String,
    },
    isTokenConsumed: { 
        type: Boolean,
        default: false
    },
    tokenExpiration:{
        type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports = mongoose.model('Verification', verificaitonSchema);