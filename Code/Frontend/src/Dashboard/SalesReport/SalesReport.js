import PeriodSalesReport from "./PeriodSalesReport";
import MonthsSalesSummary from "./MonthsSalesSummary";
import "./SalesReport.css";

function SalesReport() {
    return (
        <div className="sales-report-content-body">
            <div className="sale-reports-container sale-breakdown-container">
                <PeriodSalesReport />
            </div>
            <div className="sale-reports-container monthly-sale-summary-container">
                <MonthsSalesSummary />
            </div>
        </div>
    );
}

export default SalesReport;
