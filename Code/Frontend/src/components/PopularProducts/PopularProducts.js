import React from 'react';
import { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { getPopularProducts } from '../../api/productService';

const PopularProducts = () => {
    const [popularProducts, setPopularProducts] = useState([]);

    useEffect(() => {
        const fetchPopularProducts = async () => {
            try {
                const response = await getPopularProducts();
                setPopularProducts(response);
            } catch (err) {
                console.log(err);
            }
        };
        fetchPopularProducts();
    }, []);

    return (
        <>
            <h2>Popular Products</h2>
            {popularProducts ?
                <div className="product-list">
                    {popularProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div> :
                <p>No products right now.</p>
            }
        </>
    );
};

export default PopularProducts;
