require('dotenv').config();

const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const priceUtil = require('../utils/priceUtil');
const paymentSimulator = require('../simulator/paymentSimulator');
const dateUtil = require('../utils/dateUtils');
const activityLogger = require('../utils/activityLogger');
const ACTION_TYPES = require('../utils/actionTypes');

exports.placeOrder = async (req, res) => {
    try {
        const { billingInfo, paymentInfo, cartItems } = req.body;
        if (!cartItems || cartItems.length === 0)
            return res.status(404).json({ error: "No items found in user's cart!" });
        if (!billingInfo)
            return res.status(404).json({ error: "Billing information missing!" });
        if (!paymentInfo)
            return res.status(404).json({ error: "Payment information missing!" });
        if (!billingInfo.fullName)
            return res.status(404).json({ error: "Please provide fullname for billing!" });
        if (!billingInfo.phoneNumber)
            return res.status(404).json({ error: "Please provide phone number for billing!" });
        if (!billingInfo.address)
            return res.status(404).json({ error: "Please provide shipping address(including house/unit/apt and street name)!" });
        if (!billingInfo.city)
            return res.status(404).json({ error: "Please provide shipping city name!" });
        if (!billingInfo.state)
            return res.status(404).json({ error: "Please provide shipping state name!" });
        if (!billingInfo.country)
            return res.status(404).json({ error: "Please provide shipping country!" });
        if (!billingInfo.zipCode)
            return res.status(404).json({ error: "Please provide zip code of the shipping address!" });
        if (!paymentInfo.cardNumber || !paymentInfo.nameInCard || !paymentInfo.expiryDate || !paymentInfo.cvv)
            return res.status(404).json({ error: "Please provide all payment information!" });
        const userId = req.userInfo.userId;
        const user = await User.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found!" });

        const newOrder = new Order({
            orderBy: userId,
            orderStatus: 'pending',
            paymentStatus: 'pending',
            shippingInfo: {
                fullName: billingInfo.fullName,
                phoneNumber: billingInfo.phoneNumber,
                email: billingInfo.email,
                address: billingInfo.address,
                city: billingInfo.city,
                state: billingInfo.state,
                zipCode: billingInfo.zipCode,
                country: billingInfo.country,
            },
            createdAt: Date.now()
        });
        let subTotal = 0;
        for (const item of cartItems) {
            const product = await Product.findById(item.productId);
            if (product.availability.quantity < item.quantity)
                return res.status(400).json({ error: `Only ${product.availability.quantity} ${product.name} is available` });
            const productPrice = (product.discount > 0) ?
                priceUtil.calculatedDiscountedPrice(product.price, product.discount) :
                product.price;
            subTotal = (parseFloat(subTotal) + (productPrice * item.quantity)).toFixed(2);
            newOrder.items.push({
                product: item.productId,
                orderQuantity: item.quantity,
                orderPrice: productPrice
            });

            activityLogger.logUserActivity(userId, product, ACTION_TYPES.PURCHASED);
        }
        newOrder.subTotal = subTotal;
        newOrder.shippingCharge = parseFloat(process.env.SHIPPING_FEE);
        newOrder.grandTotal = parseFloat(subTotal) + parseFloat(newOrder.shippingCharge);
        if (!paymentSimulator.pay(paymentInfo, newOrder.grandTotal)) {
            console.log("payment failed");
            return res.status(400).json({ error: "Payment failed!" });
        }
        console.log("payment success!");
        newOrder.paymentStatus = 'paid';
        newOrder.orderStatus = 'order_placed';
        const order = await newOrder.save();

        updateProductQuantity(order);
        return res.status(200).json(order);
    } catch (error) {
        console.log("Failed to place order: " + error.message);
        return res.status(500).json({ error: "Internal server error! Something went wrong, please try again later." });
    }
};

async function updateProductQuantity(order) {
    for (const item of order.items) {
        const product = await Product.findById(item.product);
        const newQuantity = Number(product.availability.quantity) - Number(item.orderQuantity);
        product.availability = {
            inStock: (newQuantity > 0) ? true : false,
            quantity: newQuantity
        };
        product.soldCount += item.orderQuantity;
        product.save();
    }
}


exports.getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, user } = req.query;
        let userIds = [];
        if (user) {
            const users = await User.find({
                $or: [
                    { username: { $regex: user, $options: 'i' } },
                    { email: { $regex: user, $options: 'i' } },
                    { firstname: { $regex: user, $options: 'i' } },
                    { lastname: { $regex: user, $options: 'i' } }
                ]
            }).select('_id');
            userIds = users.map(user => user._id);
        }

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            populate: [
                { path: 'orderBy', select: 'username email firstname lastname' },
                { path: 'items.product', select: 'name price' }
            ],
            sort: { ['createdAt']: -1 },
            lean: true
        };

        const orders = await Order.paginate({
            status: { $ne: 'deleted' },
            ...(userIds.length > 0 && { orderBy: { $in: userIds } })
        },
            options
        );

        const formattedOrders = orders.docs.map(order => {
            order.createdAt = dateUtil.formatToWeekdayDayMonthYearHrMin(order.createdAt);
            return order;
        });

        return res.status(200).json({
            orders: formattedOrders,
            totalOrders: orders.totalDocs,
            limit: orders.limit,
            page: orders.page,
            totalPages: orders.totalPages,
            hasPrevPage: orders.hasPrevPage,
            hasNextPage: orders.hasNextPage,
            prevPage: orders.prevPage,
            nextPage: orders.nextPage
        });
    } catch (error) {
        console.error("Failed to fetch orders: ", error.message);
        return res.status(500).json({ error: "Internal server error! Something went wrong, please try again later." });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findOne({
            _id: req.params.orderId,
            status: { $ne: 'deleted' }
        });
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        order.orderStatus = orderStatus;
        await order.save();
        return res.status(200).json({ message: 'Order status updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to update order status' });
    }
};


exports.getOrderHistory = async (req, res) => {
    try {
        const userId = req.userInfo.userId;
        const sortCriteria = { ['createdAt']: -1 };
        const orders = await Order.find({
            orderBy: userId,
            status: { $ne: 'deleted' }
        })
            .populate('orderBy', 'username email')
            .populate('items.product', 'name price images')
            .sort(sortCriteria);
        const response = orders.map(order => {
            const temp = order.toObject();
            temp.createdAt = dateUtil.formatToWeekdayDayMonthYearHrMin(order.createdAt);
            return temp;
        });
        return res.status(200).json(response);
    } catch (error) {
        console.log("Failed to get order history: " + error.message);
        return res.status(500).json({ error: "Internal server error! Something went wrong, please try again later." });
    }
};


exports.getOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findOne({ _id: orderId, status: { $ne: 'deleted' } })
            .populate('orderBy', 'username email')
            .populate('items.product', 'name description price images');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        const response = order.toObject();
        response.createdAt = dateUtil.formatToWeekdayDayMonthYearHrMin(order.createdAt);
        return res.status(200).json(response);
    } catch (error) {
        console.log("Failed to get order details: " + error.message);
        return res.status(500).json({ error: "Internal server error! Something went wrong, please try again later." });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Invalid order id' });
        }
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: 'deleted' },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        return res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Failed to delete order: " + error.message);
        return res.status(500).json({ error: 'Internal server error! Something went wrong, please try again later.' });
    }
};
