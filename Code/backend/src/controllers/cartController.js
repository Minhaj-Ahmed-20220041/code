const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/cart');

exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.userInfo?.userId;
        if (!userId) return res.status(400).json({ error: "User id is missing!" });
        if (!productId) return res.status(400).json({ error: "Product id is missing!" });
        if (!quantity) return res.status(400).json({ error: "Quantity is missing!" });
        if (quantity <= 0) return res.status(400).json({ error: "At least 1 product needs to be added!" });

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found!" });
        }
        const cartItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (cartItemIndex > -1) {
            cart.items[cartItemIndex].quantity = quantity;
            await cart.save();
            res.status(200).json({ message: "Cart updated!" });
        } else {
            res.status(404).json({ error: "Item not found in cart!" });
        }
    } catch (error) {
        console.log("Cart update failed: " + error.message);
        return res.status(500).json({ error: "Internal Server Error. Failed to update cart item!" });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.userInfo?.userId;
        if (!userId) return res.status(400).json({ error: "User id is missing!" });
        if (!productId) return res.status(400).json({ error: "Product id is missing!" });

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found!" });
        }
        const updatedItems = cart.items.filter(item => item.productId.toString() !== productId);
        cart.items = updatedItems;
        await cart.save();
        res.status(200).json({ message: "Item removed from cart!" });
    } catch (error) {
        console.log("Cart item removal failed: " + error.message);
        return res.status(500).json({ error: "Internal Server Error. Failed to remove cart item!" });
    }
};



// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userInfo.userId;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      // If the item exists in the cart, update the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Otherwise, add the new item to the cart
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

// Get cart items for the logged-in user
exports.listCartItems = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(200).json({ items: [] });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve cart items' });
  }
};

