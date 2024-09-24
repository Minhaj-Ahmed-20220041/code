import React from 'react';
import { useState, useEffect } from 'react';
import Sort from "../SortingAndFiltering/Sort";
import Filter from "../SortingAndFiltering/Filter";
import Category from "../SortingAndFiltering/Category";
import PageNavigator from '../PageNavigator/PageNavigator';
import ProductCard from '../ProductCard/ProductCard';
import { getProducts } from '../../api/productService';

const Store = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sort, setSort] = useState({ sortBy: 'createdAt', sortOrder: 'desc' });
    const [filter, setFilter] = useState({ minPrice: '', maxPrice: '' });
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const category = selectedCategory ? (selectedCategory.toLocaleLowerCase()) : "";
        const response = await getProducts(category, page, 10, sort.sortBy, sort.sortOrder, filter.minPrice, filter.maxPrice);
        setProducts(response.products);
        setTotalPages(response.totalPages);
        setTotalProducts(response.totalProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [selectedCategory, page, sort, filter]);

  const handleSortChange = (selectedSort) => {
    setSort(selectedSort);
  };

  const handleFilterApply = (appliedFilter) => {
    setFilter(appliedFilter);
  };

  const handleCategoryChange = (selectedCategory) => {
    setSelectedCategory(selectedCategory === "All Categories" ? "" : selectedCategory);
  };

    return (
        <>
            <div>
                <h2 className="title">{!selectedCategory ? `All Products` : `${selectedCategory}`} ({totalProducts})</h2>
                <div className="category-sort-filter-section">
                    <Category selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
                    <div className="sort-filter-section">
                        <Sort onSortChange={handleSortChange} />
                        <Filter onFilterApply={handleFilterApply} />
                    </div>
                </div>
                {totalProducts > 0 ?
                    <div className="product-list">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div> :
                    <p>No products right now.</p>
                }
                <PageNavigator page={page} setPage={setPage} totalPages={totalPages} />
            </div>
        </>
    );
};

export default Store;
