const SearchHistory = require('../models/SearchHistory');
const UserActivity = require('../models/UserActivity');

exports.logUserActivity = (userId, product, action) => {
    UserActivity.create({
        user: userId,
        product: product._id,
        action: action
    });
}

exports.logSearchHistory = (userId, keyword) => {
    SearchHistory.create({
        user: userId,
        keyword: keyword
    });
}

