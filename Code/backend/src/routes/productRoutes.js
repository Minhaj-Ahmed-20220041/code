require('dotenv').config();

const express = require('express');
const router = express.Router();
const authMW = require('../middlewares/authMiddleware');
const productController = require('../controllers/productController');
const multer = require('multer');
const upload = multer({ dest: process.env.IMAGE_TEMP_DIR });

router.post('/', authMW.isAuthorized, authMW.isAdmin, upload.array('images'), productController.addProduct);
router.post('/bulk', authMW.isAuthorized, authMW.isAdmin, upload.single('products'), productController.addBulkProduct);

router.get('/:productId', authMW.getUserInfo, productController.getProduct);
router.get('/list/by', authMW.getUserInfo, productController.listProductWithPage);
router.get('/list/featured', authMW.getUserInfo, productController.listFeaturedProducts);
router.get('/search/by', authMW.getUserInfo, productController.search);
router.put('/:productId', authMW.isAuthorized, authMW.isAdmin, upload.array('images'), productController.updateProduct);
router.delete('/:productId', authMW.isAuthorized, authMW.isAdmin, productController.deleteProduct);
router.get('/recommended/all', authMW.isAuthorized, productController.getRecommendedProduct)

module.exports = router;