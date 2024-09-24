import React, { useState, useEffect } from 'react';
import { periodSales } from '../../api/salesService';
import { toast } from 'react-toastify';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import SalesToPieChart from '../Charts/SalesToPieChart';
import SalesToBarGraph from '../Charts/SalesToBarGraph';
import "./PeriodSalesReport.css";
import DateRangeSelector from './DateRangeSelector';
import DateInput from './DateInput';
import ChartToggleButtons from './ChartToggleButtons';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import SalesToLineChart from '../Charts/SalesToLineChart';

function PeriodSalesReport() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [dateRange, setDateRange] = useState('Today');
    const [loading, setLoading] = useState(false);

    const [salesTotal, setSalesTotal] = useState(0);
    const [salesCount, setSalesCount] = useState(0);
    const [productSold, setProductSold] = useState(0);
    const [topProduct, setTopProduct] = useState(null);
    const [salesBreakdown, setSalesBreakdown] = useState([]);

    const [isPieActive, setPieActive] = useState(true);
    const [isBarActive, setBarActive] = useState(false);
    const [isLineChartActive, setLineChartActive] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!fromDate || !toDate) return;
            setLoading(true);
            try {
                const response = await periodSales(fromDate, toDate);
                setSalesTotal(response.salesTotal);
                setSalesCount(response.salesCount);
                setProductSold(response.productSold);
                setTopProduct(response.topProduct);
                setSalesBreakdown(response.breakdownByCat);
            } catch (error) {
                console.error('Error:', error);
                toast.error(error || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fromDate, toDate]);

    useEffect(() => {
        const today = new Date();
        let startDate;
        let endDate;

        switch (dateRange) {
            case 'Today':
                startDate = endDate = today;
                break;
            case 'This week':
                startDate = startOfWeek(today);
                endDate = endOfWeek(today);
                break;
            case 'This month':
                startDate = startOfMonth(today);
                endDate = endOfMonth(today);
                break;
            case 'This year':
                startDate = startOfYear(today);
                endDate = endOfYear(today);
                break;
            case 'Last week':
                startDate = startOfWeek(subDays(today, 7));
                endDate = endOfWeek(subDays(today, 7));
                break;
            case 'Last month':
                startDate = startOfMonth(subDays(today, 30));
                endDate = endOfMonth(subDays(today, 30));
                break;
            case 'Last year':
                startDate = startOfYear(subDays(today, 365));
                endDate = endOfYear(subDays(today, 365));
                break;
            case 'Custom':
                return;
            default:
                startDate = endDate = today;
        }

        setFromDate(format(startDate, 'yyyy-MM-dd'));
        setToDate(format(endDate, 'yyyy-MM-dd'));
    }, [dateRange]);

    const handleDateRangeChange = (e) => {
        setDateRange(e.target.value);
        if (e.target.value === 'Custom') {
            // If Custom is selected, ensure Custom date input is used
            setFromDate('');
            setToDate('');
        }
    };

    const handleDateChange = (e) => {
        console.log("date changing for: " + e.target.name);
        console.log("date changing for: " + e.target.value);
        const { name, value } = e.target;
        if (name === 'fromDate') {
            console.log("from date");
            setFromDate(value);
            setDateRange('Custom');
        } else if (name === 'toDate') {
            console.log("to date");
            setToDate(value);
            setDateRange('Custom');
        }
    };

    const toggleView = (view) => {
        if (view === 'pie') {
            setPieActive(true);
            setBarActive(false);
            setLineChartActive(false);
        } else if (view === 'bar') {
            setPieActive(false);
            setBarActive(true);
            setLineChartActive(false);
        } else if (view === 'line') {
            setPieActive(false);
            setBarActive(false);
            setLineChartActive(true);
        }
    };

    const today = format(new Date(), 'yyyy-MM-dd');

    return (
        <>
            <div className="sale-report-header">
                <h2>Sales Breakdown</h2>
                <div className="sale-breakdown-date-inputs">
                    <DateInput label="From:" name="fromDate" dateValue={fromDate} handleDateChange={(e) => handleDateChange(e)} maxDate={today} />
                    <DateInput label="To:" name="toDate" dateValue={toDate} handleDateChange={(e) => handleDateChange(e)} maxDate={today} />
                    <DateRangeSelector dateRange={dateRange} handleDateRangeChange={handleDateRangeChange} />
                </div>
            </div>
            {loading ? (
                    <LoadingScreen />
                ) : (
                    <div className="sale-report-body">
                        <div className="sale-breakdown-data-viewer">
                            <div className="sales-report-box sales-breakdown-meta-box">
                                <h4>Total sales:</h4><h2>${salesTotal}</h2>
                            </div>
                            <div className="sales-report-box sales-breakdown-meta-box">
                                <h4>Number of sales:</h4><h2>{salesCount}</h2>
                            </div>
                            <div className="sales-report-box sales-breakdown-meta-box">
                                <h4>Product Sold:</h4><h2>{productSold}</h2>
                            </div>
                        </div>
                        <div className="sale-breakdown-data-viewer">
                            <div className="sales-report-box sale-breakdown-chart">
                                <ChartToggleButtons isPieActive={isPieActive} isBarActive={isBarActive} isLineChartActive={isLineChartActive} toggleView={toggleView} />
                                {salesTotal && salesTotal > 0 ? (
                                    <>
                                        {isPieActive && (<SalesToPieChart data={salesBreakdown} />)}
                                        {isBarActive && (<SalesToBarGraph data={salesBreakdown} />)}
                                        {isLineChartActive && (<SalesToLineChart data={salesBreakdown} />)}
                                    </>
                                ) : (<p>No sales data available</p>
                                )}
                            </div>
                            <div className="sales-report-box sales-top-product">
                                <h4>Top Product</h4>
                                {topProduct ? (
                                    <div className="sales-top-product">
                                        <img src={topProduct.images[0]} alt={topProduct.name} className="top-product-image" />
                                        <div className="top-product-details">
                                            <h3 className="top-product-title">{topProduct.name}</h3>
                                            <p className="top-product-price">${parseFloat(topProduct.price).toFixed(2)}</p>
                                            <p>Quantity Sold: {topProduct.sellCount}</p>
                                            <p>Total Sales: ${parseFloat(topProduct.salesOfThisProduct).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ) : `N/A`}
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}

export default PeriodSalesReport;
