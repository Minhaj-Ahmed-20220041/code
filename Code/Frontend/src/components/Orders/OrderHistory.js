import { useState, useEffect } from "react";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./OrderHistory.css";
import { orderHistory } from "../../api/orderService";
import OrderCard from "./OrderCard";

function OrderHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderHistory();
                setOrders(data);
            } catch (error) {
                toast.error(`Failed to list order history: ${error.response?.data?.error || error.message}`);
            }
        };
        fetchOrders();
    }, []);
    
    const handleOrderDelete = (deletedOrderId) => {
        setOrders(prevOrders => prevOrders.filter(order => order._id !== deletedOrderId));
    };

    return (
        <div className="order-history">
            <h2>{`My Orders (${orders.length})`}</h2>
            {orders.length > 0 ? (
                <div className="order-list-wrapper">
                    {orders.map((order) => (
                        <OrderCard key={order._id} order={order} onDelete={handleOrderDelete} />
                    ))}
                </div>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
}

export default OrderHistory;