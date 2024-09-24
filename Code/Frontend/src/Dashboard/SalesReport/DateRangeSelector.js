import "./DateRangeSelector.css";

function DateRangeSelector({ dateRange, handleDateRangeChange }) {
    return (
        <div className="date-range-selector">
            <select value={dateRange} onChange={handleDateRangeChange}>
                <option value="Today">Today</option>
                <option value="This week">This week</option>
                <option value="Last week">Last week</option>
                <option value="This month">This month</option>
                <option value="Last month">Last month</option>
                <option value="This year">This year</option>
                <option value="Last year">Last year</option>
                <option value="Custom">Custom</option>
            </select>
        </div>
    );
}

export default DateRangeSelector;
