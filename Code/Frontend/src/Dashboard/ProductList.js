import React, { useState, useEffect, useRef } from 'react';
import './ProductList.css';
import { searchProducts, updateProduct, deleteProduct } from '../api/productService'; // import updateProduct
import Modal from '../components/Modal/Modal';
import EditProductForm from '../Dashboard/EditProductForm';
import Sort from '../components/SortingAndFiltering/Sort';
import Filter from '../components/SortingAndFiltering/Filter';
import Category from '../components/SortingAndFiltering/Category';
import PageNavigator from '../components/PageNavigator/PageNavigator';
import SearchBar from '../components/Searchbar/SearchBar';
import FeatureFilter from '../components/SortingAndFiltering/FeatureFilter';
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";

import { toast } from 'react-toastify';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showActions, setShowActions] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const actionRef = useRef(null);
    const [sort, setSort] = useState({ sortBy: 'createdAt', sortOrder: 'desc' });
    const [filter, setFilter] = useState({ minPrice: '', maxPrice: '' });
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [searchKey, setSearchKey] = useState("");
    const [featured, setFeatured] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

    const closeDeleteModal = () => setConfirmDeleteModal(false);

    const closeEditModal = () => setIsEditModalOpen(false);

    const handleFeatureFilterChange = (value) => {
        setFeatured(value);
    };

    const handleSortChange = (selectedSort) => {
        setSort(selectedSort);
    };

    const handleFilterApply = (appliedFilter) => {
        setFilter(appliedFilter);
    };

    const handleCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory === "All Categories" ? "" : selectedCategory);
    };

    const handleSearchChange = (event) => {
        setSearchKey(event.target.value);
    };

    const handleSearchClick = () => {
        if (searchKey.trim() !== "") {
            fetchProducts();
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await searchProducts(
                searchKey,
                page,
                10,
                sort.sortBy,
                sort.sortOrder,
                filter.minPrice,
                filter.maxPrice,
                category,
                featured
            );
            setProducts(response.products);
            setTotalPages(response.totalPages);
            setTotalProducts(response.totalProducts);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [sort, filter, category, page, featured]);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
        setShowActions(null);
    };

    const handleDeleteClick = async (product) => {
        setConfirmDeleteModal(true);
        setSelectedProduct(product)
    }

    const handleConfirmDelete = async (productId) => {
        try {
            await deleteProduct(productId);
            toast.success('Product deleted successfully!');
            fetchProducts();
            setConfirmDeleteModal(false);
            setSelectedProduct(null);
        } catch (error) {
            toast.error('Failed to delete product');
            console.error('Error deleting product:', error);
        }
    };

    const handleUpdateProduct = async (updatedInfo, newImages) => {
        try {
            const formData = new FormData();
            formData.append('updatedProductInfo', JSON.stringify(updatedInfo));
            newImages.forEach((image, index) => {
                formData.append('images', image);
            });
            const response = await updateProduct(updatedInfo._id, formData);
            setProducts(products.map(product =>
                product._id === updatedInfo._id ? response : product
            ));
            toast.success('Product updated successfully!');
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error(error || 'Failed to update product');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionRef.current && !actionRef.current.contains(event.target)) {
                setShowActions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="product-list-page">
            {loading ? (
                <LoadingScreen />
            ) : (
                <div>
                    <div className="search-filter-wrapper">
                        <SearchBar searchKey={searchKey} onSearchChange={handleSearchChange} onSearchClick={handleSearchClick} />
                        <div className="sort-filter-section">
                            <FeatureFilter onFeatureFilterChange={handleFeatureFilterChange} />
                            <Category selectedCategory={category} onCategoryChange={handleCategoryChange} />
                            <Sort onSortChange={handleSortChange} />
                            <Filter onFilterApply={handleFilterApply} />
                        </div>
                    </div>

                    <table className="product-list-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Product Name</th>
                                <th>Brand</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Featured</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>
                                        <img src={product.images[0]} alt={product.name} className="product-list-image" />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.category.toUpperCase()}</td>
                                    <td>${parseFloat(product.price).toFixed(2)}</td>
                                    <td>{product.isFeatured ? "Yes" : "No"}</td>
                                    <td>{product.availability.quantity}</td>
                                    <td>
                                        <div className="actions-container">
                                            <button className="actions-button" onClick={() => setShowActions(product._id)}>
                                                &#x22EE;
                                            </button>
                                            {showActions === product._id && (
                                                <div className="actions-menu" ref={actionRef}>
                                                    <button onClick={() => handleEditClick(product)} className="actions-menu-item">Edit</button>
                                                    <button onClick={() => handleDeleteClick(product)} className="actions-menu-item ">Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="item-list-page-footer">
                        <p>Total Products: <strong>{totalProducts}</strong></p>
                        <PageNavigator page={page} setPage={setPage} totalPages={totalPages} />
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedProduct && (
                <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
                    <EditProductForm product={selectedProduct} onUpdate={handleUpdateProduct} />
                </Modal>
            )}

            {confirmDeleteModal && (
                <Modal isOpen={confirmDeleteModal} onClose={closeDeleteModal}>
                    <div className="confirm-delete-modal-content">
                        <h4>Are you sure you want to delete?</h4>
                        <div className="delete-modal-buttons">
                            <button className="cancel-button" onClick={closeDeleteModal}>
                                Cancel <i className="fa fa-ban"></i>
                            </button>
                            <button className="confirm-button" onClick={() => handleConfirmDelete(selectedProduct._id)}>
                                Delete <i className="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ProductList;
