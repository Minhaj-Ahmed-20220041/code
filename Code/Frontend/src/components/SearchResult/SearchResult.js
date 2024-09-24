import './SearchResult.css';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../ProductCard/ProductCard';
import { searchProducts } from '../../api/productService';
import Sort from "../SortingAndFiltering/Sort";
import Filter from "../SortingAndFiltering/Filter";
import Category from "../SortingAndFiltering/Category";
import PageNavigator from '../PageNavigator/PageNavigator';

const SearchResult = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const [totalProducts, setTotalProducts] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState({ sortBy: 'createdAt', sortOrder: 'desc' });
    const [filter, setFilter] = useState({ minPrice: '', maxPrice: '' });
    const [category, setCategory] = useState('');
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword') || '';

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const result = await searchProducts(
                    keyword,
                    page,
                    10,
                    sort.sortBy,
                    sort.sortOrder,
                    filter.minPrice,
                    filter.maxPrice,
                    category
                );
                setProducts(result.products);
                setTotalProducts(result.totalProducts);
                setTotalPages(result.totalPages);
            } catch (err) {
                console.log(err);
                setProducts([]);
            }
        };
        fetchSearchResults();
    }, [location.search, sort, filter, category, page]);

    const handleSortChange = (selectedSort) => {
        setSort(selectedSort);
    };

    const handleFilterApply = (appliedFilter) => {
        setFilter(appliedFilter);
    };

    const handleCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory === "All Categories" ? "" : selectedCategory);
    };

    return (
        <div className="search-page">
            <h2>Result({totalProducts})</h2>
            <div className="category-sort-filter-section">
                <p>Showing Results for <strong>"{`${keyword}`}"</strong></p>
                <div className="sort-filter-section">
                    <Category selectedCategory={category} onCategoryChange={handleCategoryChange} />
                    <Sort onSortChange={handleSortChange} />
                    <Filter onFilterApply={handleFilterApply} />
                </div>
            </div>
            <div className="result-product-list">
                {products.length === 0 ? "No products found." :
                    products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
            </div>
            <PageNavigator page={page} setPage={setPage} totalPages={totalPages}/>
        </div>
    );
};

export default SearchResult;
