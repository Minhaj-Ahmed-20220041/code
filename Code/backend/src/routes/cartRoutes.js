const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMW = require('../middlewares/authMiddleware');

router.post("/add", authMW.isAuthorized, cartController.addToCart);
router.get("/list", authMW.isAuthorized, cartController.listCartItems);
router.post("/update", authMW.isAuthorized, cartController.updateCartItem);
router.delete("/remove/:productId", authMW.isAuthorized, cartController.removeCartItem);

module.exports = router;
