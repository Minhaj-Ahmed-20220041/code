import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './Orders.css';
import { getAllOrders, changeOrderStatus } from '../api/orderService';
import PageNavigator from "../components/PageNavigator/PageNavigator";
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import SearchBar from '../components/Searchbar/SearchBar';

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

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [searchKey, setSearchKey] = useState("");

    const handleSearchChange = (event) => {
        setSearchKey(event.target.value);
    };

    const handleSearchClick = () => {
        if (searchKey.trim() !== "") {
            setLoading(true);
            fetchOrders();
        }
    };
    const fetchOrders = async () => {
        try {
            const response = await getAllOrders(page, 10, searchKey)
            setOrders(response.orders);
            setPage(response.page);
            setTotalOrders(response.totalOrders);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load orders');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await changeOrderStatus(orderId, newStatus);
            toast.success('Order status updated successfully');
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, orderStatus: newStatus } : order
                )
            );
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    return (
        <div className="orders-container">
            {loading ? <LoadingScreen /> :
                <>
                    <div className="search-filter-wrapper">
                        <SearchBar searchKey={searchKey} onSearchChange={handleSearchChange} onSearchClick={handleSearchClick} placeholder="Search user"/>
                        {/*<div className="sort-filter-section">
                            <FeatureFilter onFeatureFilterChange={handleFeatureFilterChange} />
                            <Category selectedCategory={category} onCategoryChange={handleCategoryChange} />
                            <Sort onSortChange={handleSortChange} />
                            <Filter onFilterApply={handleFilterApply} />
                        </div> */}
                    </div>
                    <div className="all-orders-list-body">
                        {orders.length === 0 ? (
                            <p>No orders found.</p>
                        ) : (
                            orders.map(order => (
                                <div key={order._id} className="order-item">
                                    <h3>Order ID: {order._id}</h3>
                                    <div className="order-details">
                                        <div>
                                            <span><strong>Customer:</strong> {order.orderBy.username}</span>
                                            <span><strong>Email:</strong> {order.orderBy.email}</span>
                                        </div>
                                        <div>
                                            <span><strong>Order Status:</strong> {getOrderStatusLabel(order.orderStatus)}</span>
                                            <span><strong>Payment Status:</strong> {order.paymentStatus.toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <span><strong>Order Date:</strong> {order.createdAt}</span>
                                            <span><strong>Total:</strong> ${order.grandTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="order-items">
                                        <h4>Items:</h4>
                                        {order.items.map(item => (
                                            <div key={item._id} className="order-item-row">
                                                <span>{item.product.name}</span>
                                                <span>{item.orderQuantity} x ${item.orderPrice.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-actions">
                                        <h4>Change Order Status:</h4>
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="order_placed">Order Placed</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                        </select>
                                    </div>
                                    <div className="order-total">
                                        <span>Grand Total: ${order.grandTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))
                        )
                        }
                    </div>
                    <div className="item-list-page-footer">
                        <p>Total Orders: <strong>{totalOrders}</strong></p>
                        <PageNavigator page={page} setPage={setPage} totalPages={totalPages} />
                    </div>

                </>}

        </div>
    );
};

export default Orders;
