import React from 'react';
import './Dashboard.css'; // Make sure to create this CSS file

const Dashboard = () => {
  // Mock data representing the requirements from your document
  const dashboardData = {
    totalRevenue: "₹ 1,500,000",
    bestMonth: "October",
    totalBills: "4,520",
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>Dashboard</h2>
        <p>1 year total revenue, best month details, and total bills count.</p>
      </div>

      {/* Top Row: Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <p className="metric-value">{dashboardData.totalRevenue}</p>
        </div>
        
        <div className="metric-card">
          <h3>Best Month</h3>
          <p className="metric-value">{dashboardData.bestMonth}</p>
        </div>
        
        <div className="metric-card">
          <h3>Total Bills</h3>
          <p className="metric-value">{dashboardData.totalBills}</p>
        </div>
      </div>

      {/* Bottom Row: Detailed Reports */}
      <div className="details-grid">
        <div className="detail-card">
          <h3>Monthly Revenue</h3>
          <div className="placeholder-content">
            {/* You would integrate a charting library like Recharts or Chart.js here */}
            <p>[ Bar Chart Placeholder ]</p>
          </div>
        </div>
        
        <div className="detail-card">
          <h3>Revenue by Services</h3>
          <div className="placeholder-content">
            {/* You would map over service data to create a list or progress bars here */}
            <p>[ Services List Placeholder ]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;