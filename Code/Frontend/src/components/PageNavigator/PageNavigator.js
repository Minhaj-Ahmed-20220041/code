import "./PageNavigator.css";
import { useState } from "react";

function PageNavigator({ page, setPage, totalPages }) {
    const [inputPage, setInputPage] = useState(page);

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePageInput = (e) => {
        const value = e.target.value;
        if (value === '' || (Number(value) >= 1 && Number(value) <= totalPages)) {
            setInputPage(value);
        }
    };

    const handlePageSubmit = () => {
        if (inputPage !== '' && inputPage !== page) {
            setPage(Number(inputPage));
        }
    };

    return (
        <div className="navigate-page-products">
            <button className="next-product-button" onClick={handlePrevPage} disabled={page <= 1}>
                <i className="fa fa-chevron-left" aria-hidden="true"></i> Previous
            </button>
            <span> Page <strong>{page}</strong> of {totalPages} </span>
            <button className="prev-product-button" onClick={handleNextPage} disabled={page >= totalPages}>
                Next <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </button>
            <div>
                <span>Go to Page</span>
                <input
                    type="number"
                    className="page-input"
                    value={inputPage}
                    onChange={handlePageInput}
                    onBlur={handlePageSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handlePageSubmit()}
                    min="1"
                    max={totalPages}
                    placeholder="Page"
                />
            </div>
        </div>
    );
}

export default PageNavigator;