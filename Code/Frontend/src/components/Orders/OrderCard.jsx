import { useState } from "react";
import "./OrderCard.css";
import { Link } from "react-router-dom";
import { deleteOrder } from "../../api/orderService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "../Modal/Modal";

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

function OrderCard({ order, onDelete }) {
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const closeModal = () => setConfirmDeleteModal(false);

    const handleDelete = async () => {
        try {
            await deleteOrder(order._id);
            toast.success("Order deleted");
            if (onDelete) {
                onDelete(order._id);
            }
        } catch (error) {
            toast.error("Failed to delete order:", error.message);
        }
    };

    return (
        <>
            <div className="order-summary-card">
                <div className="order-summary-header">
                    <div><p><strong>Order#:</strong> {order._id}</p></div>
                    <div><p><strong>Total items:</strong> {order.items.length}</p></div>
                    <div><p><strong>Total:</strong> ${order.grandTotal.toFixed(2)}</p></div>
                    <div><p><strong>Order Status:</strong> {getOrderStatusLabel(order.orderStatus)}</p></div>
                    <div><p><strong>Order placed:</strong> {order.createdAt}</p></div>
                </div>
                <div className="order-summary-body">
                    <div className="order-products-container">
                        {order.items.slice(0, 4).map((item) => (
                            <div key={item.product._id} className="order-products">
                                <img src={item.product.images[0]} alt="" />
                                <div className="order-products-detail">
                                    <div>
                                        <p className="order-product-title">{`${item.product.name}`}</p>
                                        <p className="order-product-price">{`$${item.orderPrice}`}</p>
                                    </div>
                                    <Link to={`/product/${item.product._id}`}><button className="order-product-view-buttton">View product</button></Link>
                                </div>
                            </div>

                        ))}
                    </div>
                    <div className="order-history-actions">
                        <Link to={`/order/${order._id}`}><button className="view-order-button">View Order Details</button></Link>
                        <button className="delete-order-button" onClick={() => setConfirmDeleteModal(true)}>Delete order</button>
                    </div>
                </div>

                {confirmDeleteModal && (
                    <Modal isOpen={confirmDeleteModal} onClose={closeModal}>
                        <div className="confirm-delete-modal-content">
                            <h4>Are you sure you want to delete?</h4>
                            <div className="delete-modal-buttons">
                                <button className="cancel-button" onClick={closeModal}>
                                    Cancel <i className="fa fa-ban"></i>
                                </button>
                                <button className="confirm-button" onClick={handleDelete}>
                                    Delete <i className="fa fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        </>
    );
}

export default OrderCard; 