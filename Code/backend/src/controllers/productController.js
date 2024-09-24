require('dotenv').config();

const Product = require('../models/Product');
const fileUtil = require('../utils/fileUtils');
const cloudinary = require('../config/cloudinaryConfig');
const mongoose = require('mongoose');
const fs = require('fs');
const priceUtil = require('../utils/priceUtil');
const activityLogger = require('../utils/activityLogger');
const ACTION_TYPES = require('../utils/actionTypes');
const SearchHistory = require('../models/SearchHistory');
const UserActivity = require('../models/UserActivity');

exports.addProduct = async (req, res) => {

    try {
        if (!req.body.productInfo)
            return res.status(400).json({ error: "Product info is missing!" });
        const productDetails = JSON.parse(req.body.productInfo);
        const err = validateProductInfo(productDetails);
        if (err)
            return res.status(400).json(err);

        const newProduct = new Product({
            name: productDetails.name,
            price: productDetails.price,
            discount: productDetails.discount,
            description: productDetails.description,
            brand: productDetails.brand,
            category: productDetails.category.toLowerCase(),
            specifications: productDetails.specifications,
            availability: {
                'inStock': true,
                'quantity': productDetails.quantity || 0
            },
            colors: productDetails.colors,
            releaseYear: productDetails.releaseYear,
            isFeatured: productDetails.isFeatured || false,
            createdBy: req.userInfo?.userId || ''
        });
        //upload product image to cloudinary
        if (req.files) {
            const uploadedImages = await uploadImages(req.files);
            newProduct.images = uploadedImages;
        }

        const savedProduct = await newProduct.save();
        productLink = productLinkBuilder(savedProduct._id);

        res.status(201).json({ productId: savedProduct._id, productLink });
    } catch (err) {
        console.log("Failed to add product: " + err.message);
        if (err.name === 'ValidationError')
            res.status(400).json({ error: err.message });
        else
            res.status(500).json({ error: 'Internal server error: Failed to add the product!' });
    }
};

const validateProductInfo = (product) => {
    if (!product.name)
        return { error: "Product name is missing!" };
    if (!product.description)
        return { error: "Product description is missing!" };
    if (!product.price)
        return { error: "Product price is missing!" };
    if (!isNumeric(product.price) || product.price < 0)
        return { error: "Product price is not valid!" };
    if (product.discount && (!isNumeric(product.discount) || product.discount < 0))
        return { error: "Product discount is not valid!" };
    if (!product.brand)
        return { error: "Product brand is missing!" };
    if (!product.category)
        return { error: "Product category is missing!" };
    if (!isValidCategory(product.category))
        return { error: "Category is not valid!" };
    let quantity = product.quantity;
    if (product.availability)
        quantity = product.availability.quantity;
    if (!quantity)
        return { error: "Product quantity is missing!" };
    if (!isNumeric(quantity) || quantity < 0)
        return { error: "Product quantity is not valid!" };

    return null;
};

exports.addBulkProduct = async (req, res) => {
    try {
        const jsonFile = req.file;
        if (!jsonFile)
            return res.status(400).json({ error: 'Product data file is missing!' });
        const raw = fs.readFileSync(jsonFile.path, 'utf-8');
        const products = JSON.parse(raw);
        for (const product of products) {
            new Product({
                name: product.name,
                price: product.price,
                description: product.description,
                brand: product.brand,
                category: product.category,
                images: product.images || [],
                specifications: product.specifications,
                availability: { 'inStock': true, 'quantity': product.quantity || 10 },
                colors: product.colors,
                releaseYear: product.releaseYear,
                isFeatured: false,
                createdBy: req.userInfo?.userId || ''
            })
                .save()
                .catch((error) => {
                    console.log("Failed to add item: " + JSON.stringify(product));
                    console.log("Error: " + error.message);
                });
        }
        fileUtil.deleteTempFiles();
        res.status(201).json({ message: 'Upload successful.', processedProducts: products.length });
    } catch (error) {
        console.log(error.message);
        if (error.name === 'SyntaxError')
            res.status(400).json({ error: "Error in json file" });
        else
            res.status(500).json({ error: "Internal server error: Failed to add the product from the file. Try again later." });
    }
}
exports.listProductWithPage = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'desc';
        const category = req.query.category?.toLowerCase() || "";
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

        const query = {
            status: { $ne: 'deleted' },
            price: { $gte: minPrice, $lte: maxPrice }
        };
        if (category && isValidCategory(category)) {
            query.category = category;
        }
        const options = {
            page: page,
            limit: limit,
            sort: {
                [sortBy]: sortOrder === 'asc' ? 1 : -1
            }
        };

        const result = await Product.paginate(query, options);

        const updatedDocs = result.docs.map(doc => {
            return refactorProductElements(doc, req.userInfo);
        });
        const response = {
            products: updatedDocs,
            totalProducts: result.totalDocs,
            limit: result.limit,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage
        };

        res.status(200).json(response);
    } catch (error) {
        console.log("Failed to list products: " + error.message);
        res.status(500).json({ error: 'Internal server error! Something went wrong, please try again later.' });
    }
};

async function uploadImages(files) {
    const uploadedImages = [];
    for (const imageFile of files) {
        const options = {
            filename_override: fileUtil.createFileName(),
            folder: process.env.CLOUDINARY_PRODUCT_DIR
        };
        const uploadResult = await cloudinary.uploader.upload(imageFile.path, options);
        uploadedImages.push(uploadResult.secure_url);
    }
    fileUtil.deleteTempFiles();
    return uploadedImages;
}

function productLinkBuilder(id) {
    return `${process.env.SERVER_URL}:${process.env.PORT}/product/${id}`;
}

exports.getProduct = async (req, res) => {
    try {
        const userInfo = req.userInfo;
        const id = req.params.productId;
        if (!id || !mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ message: 'Invalid product ID!' });
        const result = await Product.findById(id);
        if (!result)
            return res.status(404).json({ error: 'Product not found!' });
        const finalProduct = refactorProductElements(result, userInfo)
        if (userInfo && userInfo.role === 'user')
            activityLogger.logUserActivity(userInfo.userId, finalProduct, ACTION_TYPES.CLICKED);
        return res.status(200).json(finalProduct);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Internal server error! Something went wrong, please try again later.' });
    }
};

exports.listFeaturedProducts = async (req, res) => {
    try {
        const sortCriteria = { ['createdAt']: -1 }; //sort by created date-time in descending order
        const featured = await Product.find({
            'isFeatured': true,
            status: { $ne: 'deleted' }
        }).sort(sortCriteria);
        const updatedProducts = featured.map(product => {
            return refactorProductElements(product, req.userInfo);
        });
        return res.status(200).json(updatedProducts);
    } catch (error) {
        console.log("Failed to get featured products: " + error);
        return res.status(500).json({ error: "Internal server error! Something went wrong, please try again later." });
    }
};

exports.search = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortField = req.query.sortBy || 'name';
        const sortOrder = req.query.sortOrder || 'desc';
        const category = req.query.category?.toLowerCase() || "";
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
        const isFeatured = req.query.isFeatured;

        const userInfo = req.userInfo;
        if (userInfo && userInfo.role === 'user' && keyword)
            activityLogger.logSearchHistory(userInfo.userId, keyword)

        const filter = {
            status: { $ne: 'deleted' }
        };
        if (keyword) {
            filter.$or = [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { brand: { $regex: keyword, $options: 'i' } }
            ];
        }
        if (minPrice) {
            filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
        }
        if (maxPrice) {
            filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
        }
        if (isValidCategory(category)) {
            filter.category = category;
        }

        if (req.query.isFeatured) {
            filter.isFeatured = isFeatured === 'true';
        }

        const options = {
            page: page,
            limit: limit,
            sort: {
                [sortField]: (sortOrder === 'asc' ? 1 : -1)
            }
        };

        const result = await Product.paginate(filter, options);
        const updatedDocs = result.docs.map(doc => {

            return refactorProductElements(doc, userInfo);
        });
        const responseProduct = {
            keyword: keyword,
            products: updatedDocs,
            totalProducts: result.totalDocs,
            limit: result.limit,
            page: result.page,
            totalPages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage
        };
        res.status(200).json(responseProduct);
    } catch (error) {
        console.error('Error searching products:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

function refactorProductElements(product, userInfo) {
    const finalProduct = product.toObject();
    finalProduct.productLink = productLinkBuilder(product._id);
    if (product.discount > 0) {
        finalProduct.discountedPrice = priceUtil.calculatedDiscountedPrice(product.price, product.discount);
    }
    if (!(userInfo && userInfo.role === 'admin')) {
        delete finalProduct.__v;
        delete finalProduct.createdBy;
        delete finalProduct.createdAt;
        delete finalProduct.updatedAt;
    }
    return finalProduct;
}

function isValidCategory(category) {
    const allowedCategories = ['smartphone', 'laptop', 'smartwatch'];
    if (!allowedCategories.includes(category.toLowerCase())) {
        return false
    }
    return true;
}

function isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}


exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID!' });
        }
        const updatedProductInfo = JSON.parse(req.body.updatedProductInfo);

        const err = validateProductInfo(updatedProductInfo);
        if (err)
            return res.status(400).json(err);

        if (req.files) {
            const uploadedImages = await uploadImages(req.files);
            updatedProductInfo.images.push(...uploadedImages);
        }
        if (updatedProductInfo.availability.quantity > 0)
            updatedProductInfo.availability.inStock = true;

        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedProductInfo, {
            new: true,
            runValidators: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found!' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.log("Failed to update product: " + error);
        res.status(500).json({ error: 'Internal server error: Failed to update the product!' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: 'Invalid product ID!' });
        }
        const deletedProduct = await Product.findByIdAndUpdate(
            productId,
            { status: 'deleted' },
            { new: true }
        );
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found!' });
        }
        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (error) {
        console.log("Failed to delete product: " + error.message);
        res.status(500).json({ error: 'Internal server error: Failed to delete the product!' });
    }
};

exports.getRecommendedProduct = async (req, res) => {
    const userId = req.userInfo.userId;
    try {
        // Get most recent search history
        const recentSearchHistory = await SearchHistory.findOne({ user: userId }).sort({ createdAt: -1 }).exec();

        // Get top products based on recent search keywords
        const recentSearchKeyword = recentSearchHistory ? recentSearchHistory.keyword : '';
        const topProductsBySearch = await Product.find({
            $text: { $search: recentSearchKeyword },
            status: 'active'
        }).exec();

        // Get recent clicked products
        const recentClicks = await UserActivity.find({ user: userId, action: 'clicked' }).sort({ createdAt: -1 }).limit(3).exec();
        const recentClickedProductIds = recentClicks.map(activity => activity.product);

        // Find similar products based on recent clicked products
        const similarProducts = await Product.find({
            _id: { $in: recentClickedProductIds },
            status: 'active'
        }).exec();

        // Create a list of products from similar products and their categories
        const similarCategories = similarProducts.map(p => p.category);
        const topProductsByClicks = await Product.find({
            category: { $in: similarCategories },
            _id: { $nin: recentClickedProductIds }, // Exclude already clicked products
            status: 'active'
        }).exec();

        // Combine lists, remove duplicates, and sort by popularity
        const combinedProducts = [...topProductsBySearch, ...topProductsByClicks];
        const uniqueProducts = removeDuplicates(combinedProducts, '_id');

        // Sort by popularity (e.g., soldCount)
        const sortedProducts = uniqueProducts.sort((a, b) => b.soldCount - a.soldCount);

        const top10Products = sortedProducts.slice(0, 10);
        res.json(top10Products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Helper function to remove duplicates
const removeDuplicates = (arr, key) => {
    const seen = new Set();
    return arr.filter(item => {
        const duplicate = seen.has(item[key]);
        seen.add(item[key]);
        return !duplicate;
    });
};
