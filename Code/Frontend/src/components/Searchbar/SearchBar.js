import "./SearchBar.css";

function SearchBar({ searchKey, onSearchChange, onSearchClick, placeholder }) {
    return (
        <div className="search-wrapper">
            <input
                type="text"
                placeholder={placeholder ? placeholder : "Search..."}
                className="search-input"
                value={searchKey}
                onChange={onSearchChange}
            />
            <button
                onClick={onSearchClick}
                className="search-button">
                <i className="fas fa-search"></i>
            </button>
        </div>
    );
}

export default SearchBar;