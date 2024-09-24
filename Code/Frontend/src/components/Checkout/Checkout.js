import React, { useState, useEffect } from 'react';
import { useCart } from '../../cartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { placeOrder } from '../../api/orderService';
import { toast } from 'react-toastify';
import './Checkout.css';
import 'react-toastify/dist/ReactToastify.css';
import { getProfile } from '../../api/userService';

const Checkout = () => {
  const { state, dispatch } = useCart();
  const { cart } = state;
  const navigate = useNavigate();

  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    email: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    nameInCard: '',
    expiryDate: '',
    cvv: ''
  });

  const [isOrderPlaced, setIsOrderPlaced] = useState(false); // New state for animation

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile();
        const { billingInfo, paymentInfo } = response;
        if (billingInfo) setBillingInfo(billingInfo);
        if (paymentInfo) setPaymentInfo(paymentInfo);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load user information');
      }
    };

    fetchUserProfile();
  }, []);

  const handleBillingChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const totalPrice = cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

  const handlePlaceOrder = async () => {
    try {
      const cartItems = [];
      for (const item of cart) {
        cartItems.push({ productId: item._id, quantity: item.quantity });
      }
      const orderData = {
        billingInfo,
        paymentInfo,
        cartItems,
      };

      const data = await placeOrder(orderData);
      setIsOrderPlaced(true); // Trigger animation

      // Delay navigation to show the animation
      setTimeout(() => {
        toast.success('Order placed successfully!');
        dispatch({ type: 'CLEAR_CART' });
        navigate(`/order/${data._id}`, { state: { newOrder: true } });
      }, 2000); // 2 seconds delay
    } catch (error) {
      toast.error(`Failed to place order: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className={`checkout-page ${isOrderPlaced ? 'order-placed-animation' : ''}`}>
      <h1>Checkout</h1>
      <div className="checkout-container">
        <div className="billing-info">
          <h2>Billing Information</h2>
          <input type="text" name="fullName" placeholder="Full Name" value={billingInfo.fullName} onChange={handleBillingChange} />
          <input type="text" name="phoneNumber" placeholder="Phone Number" value={billingInfo.phoneNumber} onChange={handleBillingChange} />
          <input type="text" name="address" placeholder="Address" value={billingInfo.address} onChange={handleBillingChange} />
          <input type="text" name="city" placeholder="City" value={billingInfo.city} onChange={handleBillingChange} />
          <input type="text" name="state" placeholder="State" value={billingInfo.state} onChange={handleBillingChange} />
          <input type="text" name="zipCode" placeholder="Zip Code" value={billingInfo.zipCode} onChange={handleBillingChange} />
          <input type="text" name="country" placeholder="Country" value={billingInfo.country} onChange={handleBillingChange} />
          <input type="email" name="email" placeholder="Email" value={billingInfo.email} onChange={handleBillingChange} />
        </div>
        <div className="payment-info">
          <h2>Payment Information</h2>
          <input type="text" name="cardNumber" placeholder="Card Number" value={paymentInfo.cardNumber} onChange={handlePaymentChange} />
          <input type="text" name="nameInCard" placeholder="Name on Card" value={paymentInfo.nameInCard} onChange={handlePaymentChange} />
          <input type="text" name="expiryDate" placeholder="Expiry Date (MM/YY)" value={paymentInfo.expiryDate} onChange={handlePaymentChange} />
          <input type="text" name="cvv" placeholder="CVV" value={paymentInfo.cvv} onChange={handlePaymentChange} />
        </div>
        <div className="order-summary">
          <h2>Order Summary</h2>
          {cart.map((item, index) => (
            <div key={index} className="order-summary-item">
              <p>{item.name} - {item.quantity} x ${parseFloat(item.price).toFixed(2)}</p>
            </div>
          ))}
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <button onClick={handlePlaceOrder} className="place-order-button">Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
