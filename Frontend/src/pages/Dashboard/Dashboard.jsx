import { useEffect, useState } from 'react';
import InfoCard from '../../components/Cards/InfoCard';
import LineChart from '../../components/Charts/LineChart';
import Alert from '../../components/Alert/Alert';
import { dashboardData } from '../../api/mockData';
import { getEnergyTimeSeries } from '../../api/energyApi';
import './Dashboard.css';

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await getEnergyTimeSeries(null, 'daily');
      setChartData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Real-time monitoring of smart campus infrastructure</p>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-grid">
        <InfoCard
          title="Energy Consumption"
          value={dashboardData.stats.energy.current}
          icon={<i className="fas fa-bolt"></i>}
          subtitle="Current usage"
          trend={dashboardData.stats.energy.trend}
          trendValue={dashboardData.stats.energy.change}
          color="primary"
        />
        
        <InfoCard
          title="Space Utilization"
          value={dashboardData.stats.space.utilization}
          icon={<i className="fas fa-building"></i>}
          subtitle="Overall campus"
          trend={dashboardData.stats.space.trend}
          trendValue={dashboardData.stats.space.change}
          color="success"
        />
        
        <InfoCard
          title="Open Tickets"
          value={dashboardData.stats.maintenance.open}
          icon={<i className="fas fa-tools"></i>}
          subtitle="Maintenance requests"
          trend={dashboardData.stats.maintenance.trend}
          trendValue={dashboardData.stats.maintenance.change}
          color="warning"
        />
        
        <InfoCard
          title="Active Alerts"
          value={dashboardData.stats.alerts.critical}
          icon={<i className="fas fa-bell"></i>}
          subtitle={`${dashboardData.stats.alerts.warnings} warnings, ${dashboardData.stats.alerts.info} info`}
          color="danger"
        />
      </div>

      {/* Energy Chart */}
      <div className="dashboard-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Weekly Energy Consumption</h2>
            <div className="section-actions">
              <button className="btn-outline">View Details</button>
            </div>
          </div>
          {!loading && chartData.length > 0 && (
            <LineChart data={chartData} height={250} />
          )}
          {loading && <div className="loading-state">Loading chart data...</div>}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="dashboard-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Recent Alerts</h2>
            <a href="/maintenance" className="link-text">View All</a>
          </div>
          <div className="alerts-container">
            {dashboardData.recentAlerts.map(alert => (
              <Alert
                key={alert.id}
                type={alert.type}
                message={`${alert.message} • ${alert.timestamp}`}
                dismissible={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="dashboard-section">
        <div className="quick-stats-grid">
          <div className="stat-item">
            <div className="stat-icon"><i className="fas fa-thermometer-half"></i></div>
            <div className="stat-content">
              <div className="stat-label">Average Temperature</div>
              <div className="stat-value">22.5°C</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon"><i className="fas fa-lightbulb"></i></div>
            <div className="stat-content">
              <div className="stat-label">Active Lights</div>
              <div className="stat-value">1,247</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon"><i className="fas fa-door-open"></i></div>
            <div className="stat-content">
              <div className="stat-label">Open Doors</div>
              <div className="stat-value">143</div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon"><i className="fas fa-users"></i></div>
            <div className="stat-content">
              <div className="stat-label">Current Occupancy</div>
              <div className="stat-value">3,842</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
