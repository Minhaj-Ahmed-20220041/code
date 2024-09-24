const mongoose = require('mongoose');

const searchHistoryScheme = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    keyword : {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('SearchHistory', searchHistoryScheme);