const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware.isAuthorized, orderController.placeOrder);
router.get('/history', authMiddleware.isAuthorized, orderController.getOrderHistory);//Used by user
router.delete('/delete/:orderId', authMiddleware.isAuthorized, orderController.deleteOrder); //User deleting their own order

router.get('/all', authMiddleware.isAuthorized, authMiddleware.isAdmin, orderController.getAllOrders);//Used by admin
router.put('/:orderId/status', authMiddleware.isAuthorized, authMiddleware.isAdmin, orderController.updateOrderStatus);
router.get('/:orderId', authMiddleware.isAuthorized, orderController.getOrder);

module.exports = router;
