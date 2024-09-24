import { useState, useEffect } from "react";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import { getMonthsSummaryOf } from "../../api/salesService";
import { toast } from 'react-toastify';
import SalesToLineChart from "../Charts/SalesToLineChart";
import ChartToggleButtons from "./ChartToggleButtons";
import SalesToBarGraph from "../Charts/SalesToBarGraph";
import "./MonthsSalesSummary.css"

function MonthsSalesSummary() {
    const [loading, setLoading] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());
    const [monthlySales, setMonthlySales] = useState([]);
    const [salesTotal, setSalesTotal] = useState(0);
    const [isBarActive, setBarActive] = useState(false);
    const [isLineChartActive, setLineChartActive] = useState(true);

    const years = [];
    for (let i = 0; i < 4; i++) {
        years.push(new Date().getFullYear() - i);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!year)
                return;
            setLoading(true);
            try {
                const response = await getMonthsSummaryOf(year);
                setMonthlySales(response.monthlySales);
                setSalesTotal(response.salesTotal);
            } catch (error) {
                console.error('Error:', error);
                toast.error(error.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [year]);

    const handleYearChange = (event) => {
        setYear(parseInt(event.target.value));
    };

    const toggleView = (view) => {
        if (view === 'bar') {
            setBarActive(true);
            setLineChartActive(false);
        } else if (view === 'line') {
            setBarActive(false);
            setLineChartActive(true);
        }
    };

    return (
        <>
            <div className="sale-report-header">
                <h2>Monthly Sales Summary</h2>
                <div className="sale-report-inputs">
                    <select value={year} onChange={handleYearChange}>
                        {years.map((yr) => (
                            <option key={yr} value={yr}>
                                {yr}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {loading ? (
                <LoadingScreen />
            ) : (
                <div className="sales-report-box">
                    <ChartToggleButtons isPieActive={false} isBarActive={isBarActive} isLineChartActive={isLineChartActive} toggleView={toggleView} />
                    <h4>Total Sales: {`$${salesTotal}`}</h4>
                    <div className="sale-chart-container">
                        {salesTotal > 0 ? (
                            <>
                                {isBarActive && (<SalesToBarGraph data={monthlySales} />)}
                                {isLineChartActive && (<SalesToLineChart data={monthlySales} />)}
                            </>
                        ) : (
                            <>
                                <p>No sales data for the year {year}.</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default MonthsSalesSummary;
