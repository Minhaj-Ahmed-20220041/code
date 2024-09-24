import React, { useState } from 'react';
import "./Sort.css";

const Sort = ({ onSortChange }) => {
    const sortOptions = [
        { label: "Price: Low-High", value: { sortBy: "price", sortOrder: "asc" } },
        { label: "Price: High-Low", value: { sortBy: "price", sortOrder: "desc" } },
        { label: "New-Old", value: { sortBy: "createdAt", sortOrder: "desc" } },
        { label: "Old-New", value: { sortBy: "createdAt", sortOrder: "asc" } },
        { label: "Title: A-Z", value: { sortBy: "name", sortOrder: "asc" } },
        { label: "Title: Z-A", value: { sortBy: "name", sortOrder: "desc" } }
    ];

    const defaultSortValue = JSON.stringify(sortOptions.find(option => option.label === "New-Old").value);
    const [selectedSort, setSelectedSort] = useState(defaultSortValue);

    const handleSortChange = (event) => {
        const newValue = event.target.value;
        setSelectedSort(newValue);
        onSortChange(JSON.parse(newValue));
    };

    return (
        <div className="select-sort">
            <select value={selectedSort} onChange={handleSortChange}>
                {sortOptions.map((option, index) => (
                    <option key={index} value={JSON.stringify(option.value)} className="sort-item">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Sort;
