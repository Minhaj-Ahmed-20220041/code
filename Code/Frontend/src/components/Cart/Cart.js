import React from 'react';
import './Cart.css';
import { useCart } from '../../cartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import { toast } from 'react-toastify';

const Cart = () => {
    const { state, dispatch } = useCart();
    const { cart } = state;
    const { state: authState } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!authState.isLoggedIn) {
            navigate('/login?redirect=checkout');
        } else {
            navigate('/checkout');
        }
    };

    const handleRemoveFromCart = (product) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: product._id });
        toast.success("Item Removed.");
    };

    const handleQuantityChange = (product, quantity) => {
        const newQuantity = Math.max(1, quantity);
        dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { product, quantity: newQuantity } });
    };

    const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

    return (
        <div className="cart-page">
            <h1>Your Shopping Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="cart-container">
                    {cart.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img src={item.images[0]} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <div className="cart-item-actions">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item, parseInt(e.target.value, 10))}
                                        className="cart-item-quantity"
                                        min="1"
                                    />
                                    <button onClick={() => handleRemoveFromCart(item)} className="cart-item-remove">
                                        Remove
                                    </button>
                                </div>
                                <p className="cart-item-price">${parseFloat(item.price).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                    <div className="cart-summary">
                        <h3>Total: ${totalPrice.toFixed(2)}</h3>
                        <button onClick={handleCheckout} className="checkout-button">Proceed to Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
