const Order = require("../models/Order");
const dateUtils = require("../utils/dateUtils");

// exports.getSale = async (req, res) => {
//     return res.status(200).json({ message: "sales" });
// };
exports.getSalesBreakdown = async (req, res) => {
    try {
        let { from, to } = req.query;
        console.log(from);

        if (!from) {
            from = dateUtils.formatToYYYYMMdd(new Date());
        }
        if (!to) {
            to = dateUtils.formatToYYYYMMdd(new Date());
        }
        const startDate = new Date(from + 'T00:00:00.000Z');
        const endDate = new Date(to + 'T23:59:59.999Z');

        // Fetch all orders placed within the date range
        const orders = await Order.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            },
            orderStatus: { $ne: 'pending' },
            paymentStatus: 'paid',
        }).populate('items.product');

        let salesTotal = 0;
        let salesCount = 0;
        let productSold = 0;
        const salesByCategory = {};
        let topProduct = { _id: null, name: null, price: 0, salesOfThisProduct: 0, sellCount: 0, images:[] };
        const productSales = {};

        // Iterate over each order to calculate total sales and sales by category
        orders.forEach(order => {
            salesCount++;
            order.items.forEach(item => {
                const product = item.product;
                const saleAmount = item.orderPrice * item.orderQuantity;
                salesTotal += saleAmount;
                productSold += item.orderQuantity;

                // Track sales by category
                if (!salesByCategory[product.category]) {
                    salesByCategory[product.category] = 0;
                }
                salesByCategory[product.category] += saleAmount;

                // Track individual product sales
                if (!productSales[product._id]) {
                    productSales[product._id] = {
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        salesOfThisProduct: 0,
                        sellCount: 0,
                        images: product.images,
                    };
                }
                productSales[product._id].salesOfThisProduct += saleAmount;
                productSales[product._id].sellCount += item.orderQuantity;

                // Determine top product
                if (productSales[product._id].salesOfThisProduct > topProduct.salesOfThisProduct) {
                    topProduct = productSales[product._id];
                }
            });
        });

        const breakdownByCat = Object.keys(salesByCategory).map(category => ({
            name: category.toUpperCase(),
            value: salesByCategory[category].toFixed(2),
        }));

        return res.status(200).json({
            salesTotal: salesTotal.toFixed(2),
            salesCount,
            productSold,
            topProduct: {
                _id: topProduct._id,
                name: topProduct.name,
                price: topProduct.price.toFixed(2),
                salesOfThisProduct: topProduct.salesOfThisProduct.toFixed(2),
                sellCount: topProduct.sellCount,
                images: topProduct.images
            },
            breakdownByCat,
        });
    } catch (error) {
        console.error('Error fetching sales data:', error);
        return res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};




exports.getEachMonthSummary = async (req, res) => {
    try {
        let year = req.query.year;
        if (!year || year === undefined || isNaN(year))
            year = new Date().getFullYear();
        else
            year = parseInt(year);

        // Aggregating sales data by month
        const salesData = await Order.aggregate([
            {
                $match: {
                    orderStatus: { $ne: 'pending' },
                    paymentStatus: 'paid',
                    createdAt: {
                        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                        $lt: new Date(`${year + 1}-01-01T00:00:00.000Z`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalSales: { $sum: "$grandTotal" }
                }
            },
            {$sort: { "_id": 1 }} // Sort by month
        ]);

        const salesTotal = salesData.reduce((acc, curr) => acc + curr.totalSales, 0);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = monthNames.map((month, index) => {
            const monthData = salesData.find(s => s._id === index + 1);
            return { name: month, value: monthData ? monthData.totalSales : 0 };
        });

        return res.status(200).json({ monthlySales: data, salesTotal });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};
