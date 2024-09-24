import React from 'react';
import './ProductCard.css';
import { Link } from 'react-router-dom';
import { useCart } from '../../cartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductCard = ({ product }) => {
  const { _id, images, name, description, price } = product;
  const { dispatch } = useCart();

  const handleAddToCart = async () => {
    if (!product.availability.inStock) {
      toast.info("Sorry, the product is out of stock.");
      return;
    }
    try {
      // Call the backend to add the item to the cart
      const response = await dispatch({ type: 'ADD_TO_CART', payload: product });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart.');
    }
  };

  return (
    <div className="product-card">
      <img src={images[0]} alt={name} className="product-card-image" />
      <div className="product-card-details">
        <h3 className="product-card-title">{product.name}</h3>
        {/* <p className="product-card-description">{product.description}</p> */}
        <p className="product-card-brand">{product.brand}</p>
        <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
        <div className="product-buttons">
          <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
          <Link to={`/product/${product._id}`}>
            <button className="view-product">View Product</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
