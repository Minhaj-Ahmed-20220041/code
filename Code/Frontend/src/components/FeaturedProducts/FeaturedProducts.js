import React from 'react';
import { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { getFeaturedProduct } from '../../api/productService';
import './FeaturedProducts.css';

const FeaturedProhducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await getFeaturedProduct();
                setFeaturedProducts(response);
            } catch (err) {
                console.log(err);
            }
        };
        fetchFeaturedProducts();
    }, []);

    return (
        <>
            <h2>Featured Products</h2>
            {featuredProducts ?
                <div className="featured-product-list">
                    {featuredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div> :
                <p>No featured products right now.</p>
            }
        </>
    );
};

export default FeaturedProhducts;
