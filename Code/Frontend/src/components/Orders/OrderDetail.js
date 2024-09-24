import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../../api/orderService';
import "./OrderDetail.css";
import { Link } from 'react-router-dom';

const getOrderStatusLabel = (status) => {
    switch (status) {
        case 'pending':
            return 'PENDING';
        case 'order_placed':
            return 'ORDER PLACED';
        case 'shipped':
            return 'SHIPPED';
        case 'delivered':
            return 'DELIVERED';
        default:
            return 'N/A';
    }
};

const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await getOrder(orderId);
                setOrder(response);
            } catch (err) {
                console.log(err);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    if (!order) 
        return <p style={{ display: "flex", justifyContent: "center"}}>Loading...</p>;

    return (
        <div className="order-detail-view-container">
            <div className="order-info-header">
                <h3>Order#{order._id}</h3>
                <p><strong>Order Date:</strong> {order.createdAt}</p>
                <p><strong>Order Status:</strong> {getOrderStatusLabel(order.orderStatus)}</p>
            </div>
            <div className="order-info-section">
                <h5>Order Items({order.items.length})</h5>
                <div className="order-product-list">
                    {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                            <div key={index} className="order-product-info">
                                <img src={item.product.images[0]} alt={item.product.name}></img>
                                <div className="order-product-name-desc">
                                    <Link to={`/product/${item.product._id}`}><p><strong>{item.product.name}</strong> </p></Link>
                                    <p>{item.product.description}</p>
                                </div>
                                <p><strong>${(item.orderPrice).toFixed(2)}</strong></p>
                                <p><strong>{item.orderQuantity}</strong> </p>
                                <p className="product-total-amount"><strong>${(item.orderQuantity * item.orderPrice).toFixed(2)}</strong> </p>
                            </div>
                        ))
                    ) : (
                        <p>No items in this order.</p>
                    )}
                </div>
                <div className="order-summary-box">
                    <p><strong>Subtotal:</strong> ${(order.subTotal).toFixed(2)}</p>
                    <p><strong>Shipping Charge:</strong> ${(order.shippingCharge).toFixed(2)}</p>
                    <p><strong>Grand Total:</strong> ${(order.grandTotal).toFixed(2)}</p>
                </div>
            </div>
            <div className="order-shipping-info">
                <p><strong>Shipped To:</strong></p>
                <p>{order.shippingInfo.fullName}</p>
                <p>{order.shippingInfo.phoneNumber}</p>
                <p>{order.shippingInfo.email}</p>
                <p>{order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state}, {order.shippingInfo.zipCode}, {order.shippingInfo.country}</p>
            </div>
        </div>
    );
};

export default OrderDetail;
