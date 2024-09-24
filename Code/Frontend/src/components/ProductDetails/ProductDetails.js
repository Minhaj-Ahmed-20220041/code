import React, { useEffect, useState } from 'react';
import './ProductDetails.css';
import { useParams } from 'react-router-dom';
import { useCart } from '../../cartContext';
import Slider from 'react-slick';
import { fetchProductById, getProducts } from '../../api/productService';
import ProductCard from '../ProductCard/ProductCard';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { productId } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const defaultImage = "/no-image.jpg";

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetchProductById(productId);
        setProduct(response);

        const relatedResponse = await getProducts(response.category, 1, 5, "", "");
        setRelatedProducts(relatedResponse.products.filter(p => p._id !== productId));
      } catch (err) {
        console.log(err);
      }
    };
    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return <p>Product not found</p>;
  }

  const handleAddToCart = () => {
    if (!product.availability.inStock) {
      toast.info("Sorry, the product is out of stock.");
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: product });
    toast.success(`${product.name} added to cart!`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1
  };

  return (
    <>
      <div className="modern-product-details">
        <div className="product-details-container">
          <div className="product-image-container">
            <img src={product.images[0] || defaultImage} alt={product.name} className="product-image" />
          </div>
          <div className="product-info-container">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-description">{product.description}</p>
            <div className="product-price">
              <h2>${parseFloat(product.price).toFixed(2)}</h2>
            </div>
            <button onClick={handleAddToCart} className="add-to-cart-button">Add to Cart</button>
            <div>
              <div className="product-specifications">
                <h3>Specifications:</h3>
                <ul>
                  <li>Display: {product.specifications.display}</li>
                  <li>Processor: {product.specifications.processor}</li>
                  <li>Memory: {product.specifications.memory}</li>
                  <li>Storage: {product.specifications.storage}</li>
                  <li>Rear Camera: {product.specifications.rearCamera}</li>
                  <li>Front Camera: {product.specifications.frontCamera}</li>
                  <li>Battery: {product.specifications.battery}</li>
                  <li>Operating System: {product.specifications.operatingSystem}</li>
                  <li>WiFi: {product.specifications.wifi}</li>
                  <li>Bluetooth: {product.specifications.bluetooth}</li>
                </ul>
              </div>
              <div className="product-availability inline-container">
                <h3>Availability:</h3>
                <p>{product.availability.inStock ? 'In Stock' : 'Out of Stock'} ({product.availability.quantity} available)</p>
              </div>
              <div className="product-colors">
                <h3>Available Colors:</h3>
                <ul>
                  {product.colors.map(color => (
                    <li key={color}>{color}</li>
                  ))}
                </ul>
              </div>
              <div className="product-release-year inline-container">
                <h3>Release Year:</h3>
                <p>{product.releaseYear}</p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="customer-reviews">
          <h2>Customer Reviews</h2>
          <div className="review">
            <p><strong>John Doe</strong></p>
            <p>★★★★☆</p>
            <p>Great product, highly recommend!</p>
          </div>
          <div className="review">
            <p><strong>Jane Smith</strong></p>
            <p>★★★★★</p>
            <p>Excellent quality and fast shipping!</p>
          </div>
        </div> */}
        <div className="related-products">
          <h2>Related Products</h2>
          <Slider {...settings} className="related-products-carousel">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
