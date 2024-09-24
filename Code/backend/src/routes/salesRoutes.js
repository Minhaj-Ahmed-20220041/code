const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");
const authWare = require('../middlewares/authMiddleware');

//Gets sales of each category for given time period
router.get("/breakdown", authWare.isAuthorized, authWare.isAdmin, salesController.getSalesBreakdown);
//Gets total sales of each month for given year
router.get("/months-summary", authWare.isAuthorized, authWare.isAdmin,salesController.getEachMonthSummary);

// router.get("/of/brand", salesController.getSale);
// router.get("/top-selling", salesController.getSale);
// router.get("/featured", salesController.getSale);

module.exports = router;