const mongoose = require('mongoose');
const ACTION_TYPES = require('../utils/actionTypes')

const userActivityScheme = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product : {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    action : {
        type: String,
        enum: [ACTION_TYPES.CLICKED, ACTION_TYPES.PURCHASED],
        required: true
    }
}, {timestamps: true});

module.exports =  mongoose.model('UserActivity', userActivityScheme);
