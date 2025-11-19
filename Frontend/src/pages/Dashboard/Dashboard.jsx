import { useEffect, useState } from 'react';
import InfoCard from '../../components/Cards/InfoCard';
import LineChart from '../../components/Charts/LineChart';
import Alert from '../../components/Alert/Alert';
import { getDashboardStats, getRecentAlerts } from '../../api/dashboardApi';
import { getEnergyTimeSeries } from '../../api/energyApi';
import './Dashboard.css';

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardStats, energyData, alertsData] = await Promise.all([
        getDashboardStats(),
        getEnergyTimeSeries(null, 'daily'),
        getRecentAlerts()
      ]);
      
      setStats(dashboardStats.stats || dashboardStats);
      setChartData(energyData);
      setAlerts(alertsData);
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

      {loading ? (
        <div className="loading-state">Loading dashboard data...</div>
      ) : (
        <>
          <div className="dashboard-grid">
            <InfoCard
              title="Energy Consumption"
              value={stats?.energy?.current || '0 kWh'}
              icon={<i className="fas fa-bolt"></i>}
              subtitle="Current usage"
              trend={stats?.energy?.trend || 'neutral'}
              trendValue={stats?.energy?.change || '0%'}
              color="primary"
            />
            
            <InfoCard
              title="Space Utilization"
              value={stats?.space?.utilization || '0%'}
              icon={<i className="fas fa-building"></i>}
              subtitle="Overall campus"
              trend={stats?.space?.trend || 'neutral'}
              trendValue={stats?.space?.change || '0%'}
              color="success"
            />
            
            <InfoCard
              title="Open Tickets"
              value={stats?.maintenance?.open || 0}
              icon={<i className="fas fa-tools"></i>}
              subtitle="Maintenance requests"
              trend={stats?.maintenance?.trend || 'neutral'}
              trendValue={stats?.maintenance?.change || '0%'}
              color="warning"
            />
            
            <InfoCard
              title="Active Alerts"
              value={stats?.alerts?.critical || 0}
              icon={<i className="fas fa-bell"></i>}
              subtitle={`${stats?.alerts?.warnings || 0} warnings, ${stats?.alerts?.info || 0} info`}
              color="danger"
            />
          </div>

          <div className="dashboard-section">
            <div className="section-card">
              <div className="section-header">
                <h2 className="section-title">Weekly Energy Consumption</h2>
                <div className="section-actions">
                  <button className="btn-outline">View Details</button>
                </div>
              </div>
              {chartData && chartData.length > 0 ? (
                <LineChart data={chartData} height={250} />
              ) : (
                <div className="loading-state">No chart data available</div>
              )}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-card">
              <div className="section-header">
                <h2 className="section-title">Recent Alerts</h2>
                <a href="/maintenance" className="link-text">View All</a>
              </div>
              <div className="alerts-container">
                {alerts && alerts.length > 0 ? (
                  alerts.map(alert => (
                    <Alert
                      key={alert.id}
                      type={alert.type}
                      message={`${alert.message} • ${alert.timestamp}`}
                      dismissible={false}
                    />
                  ))
                ) : (
                  <div className="loading-state">No recent alerts</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
