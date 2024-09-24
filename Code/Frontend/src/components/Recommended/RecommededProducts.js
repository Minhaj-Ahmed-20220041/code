import React from 'react';
import { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { getRecommendedProducts } from '../../api/productService';

const RecommededProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchRecomProducts = async () => {
            try {
                const response = await getRecommendedProducts();
                setProducts(response);
            } catch (err) {
                console.log(err);
            }
        };
        fetchRecomProducts();
    }, []);

    return (
        <>
            <h2>Recommended Products</h2>
            {products.length > 0 ?
                <div className="product-list">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div> :
                <p>No products right now.</p>
            }
        </>
    );
};

export default RecommededProducts;
