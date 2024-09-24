import "./ChartToggleButtons.css";

function ChartToggleButtons({ isPieActive, isBarActive, isLineChartActive, toggleView }) {
    return (
        <div className="chart-toggle-buttons">
            <button className={isPieActive ? 'pie-chart-btn active-chart' : 'pie-chart-btn'} onClick={() => toggleView('pie')}>
                <i className="fa fa-pie-chart"></i>
            </button>
            <button className={isBarActive ? 'bar-chart-btn  active-chart' : 'bar-chart-btn'} onClick={() => toggleView('bar')}>
                <i className="fa-solid fa-chart-simple"></i>
            </button>
            <button className={isLineChartActive ? 'line-chart-btn active-chart' : 'line-chart-btn'} onClick={() => toggleView('line')}>
            <i className="fa fa-line-chart"></i>
            </button>
        </div>
    );
}

export default ChartToggleButtons;
