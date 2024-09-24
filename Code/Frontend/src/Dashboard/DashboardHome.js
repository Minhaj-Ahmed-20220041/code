import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SalesToLineChart from './Charts/SalesToLineChart';
import './Dashboard.css';

const Dashboard = () => {
  const [lineChartData, setLineChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesSummary = async () => {
      try {
        // Fetch the sales summary data from /months-summary route
        const response = await axios.get('http://localhost:3001/months-summary');
        const summaryData = response.data;

        // Transform the data for the line chart
        const lineChartData = summaryData.map((item) => ({
          name: item.month,   // 'month' should be part of the response
          value: item.salesValue,  // 'salesValue' should be part of the response
        }));

        setLineChartData(lineChartData);
      } catch (error) {
        console.error('Error fetching sales summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesSummary();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-row">
        <div className="dashboard-item">
          <h2>Sales Summary</h2>
          <SalesToLineChart data={lineChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
