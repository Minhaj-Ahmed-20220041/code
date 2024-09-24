import React, { useState, useRef, useEffect } from 'react';
import "./Filter.css";

const Filter = ({ onFilterApply }) => {
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const filterMenuRef = useRef(null);

    const handlePriceChange = (event) => {
        const { name, value } = event.target;
        if (name === 'minPrice') {
            setMinPrice(value);
        } else if (name === 'maxPrice') {
            setMaxPrice(value);
        }
    };

    const handleApply = () => {
        onFilterApply({ minPrice, maxPrice });
        setShowFilters(false);
    };

    const handleClickOutside = (event) => {
        if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
            setShowFilters(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="filter-wrapper" ref={filterMenuRef}>
            <button className="filter-toggle-button" onClick={() => setShowFilters((prev) => !prev)}>
                <i className="fas fa-filter"></i>Filters
            </button>
            {showFilters && (
                <div className="filter-menu">
                    <div className="filter-price">
                        <div>
                            <label>
                                Min Price:
                                <input
                                    type="number"
                                    name="minPrice"
                                    value={minPrice}
                                    onChange={handlePriceChange}
                                />
                            </label>

                        </div>

                        <div>
                            <label>
                                Max Price:
                                <input
                                    type="number"
                                    name="maxPrice"
                                    value={maxPrice}
                                    onChange={handlePriceChange}
                                />
                            </label>

                        </div>
                    </div>
                    <button className="apply-filter-button" onClick={handleApply}>
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
};

export default Filter;
