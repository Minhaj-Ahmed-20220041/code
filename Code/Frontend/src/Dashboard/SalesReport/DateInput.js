import "./DateInput.css";

function DateInput({ label, name, dateValue, handleDateChange, maxDate }) {
    return (
        <div className="date-input">
            <label>
                {label}
                <input
                    name={name}
                    type="date"
                    value={dateValue}
                    onChange={handleDateChange}
                    max={maxDate}
                    required
                />
            </label>
        </div>
    );
}

export default DateInput;
