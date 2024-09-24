import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory, setPage, selectedSort, setSelectedSort, sortOptions }) => {

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    const selected = sortOptions.find(option => option.label === event.target.value);
    setSelectedSort(selected.value);
  };

  return (
    <>
      <div className="filter">
        <div className="category-filter">
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="sort-filter">
          <span>Sort By:</span>
          <select value={selectedSort.label} onChange={handleSortChange}>
            {sortOptions.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default CategoryFilter;
