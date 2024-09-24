import { useState } from "react";
import "./FeatureFilter.css";

function FeatureFilter({ onFeatureFilterChange }) {
    const [isFeatured, setIsFeatured] = useState(false);

    const handleIsFeaturedChange = (event) => {
        setIsFeatured(event.target.checked);
        onFeatureFilterChange(event.target.checked);
    };

    return (
        <div className="feature-filter">
            <div className="checkbox-wrapper-1">
                <input id="example-1" className="substituted" type="checkbox"
                    checked={isFeatured}
                    onChange={handleIsFeaturedChange}
                />
                <label htmlFor="example-1">Featured Only</label>
            </div>
        </div>
    );

}

export default FeatureFilter;