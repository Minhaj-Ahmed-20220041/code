import React from 'react';
import "./Category.css";

const Category = ({ selectedCategory, onCategoryChange }) => {
    const categories = ["Smartphone", "Laptop", "Smartwatch"];

    return (
        <div className="select-category">
            <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                    <option key={index} value={category.toLowerCase()} className="category-item">
                        {category}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Category;
