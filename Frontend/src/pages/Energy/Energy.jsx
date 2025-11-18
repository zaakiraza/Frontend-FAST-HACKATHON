import { useEffect, useState } from 'react';
import InfoCard from '../../components/Cards/InfoCard';
import LineChart from '../../components/Charts/LineChart';
import SimpleTable from '../../components/Tables/SimpleTable';
import { getEnergySummary, getBuildings, getEnergyTimeSeries, getEnergyAnomalies } from '../../api/energyApi';
import './Energy.css';

const Energy = () => {
  const [summary, setSummary] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [timeRange, setTimeRange] = useState('hourly');
  const [chartData, setChartData] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadChartData();
  }, [selectedBuilding, timeRange]);

  const loadInitialData = async () => {
    try {
      const [summaryData, buildingsData, anomaliesData] = await Promise.all([
        getEnergySummary(),
        getBuildings(),
        getEnergyAnomalies()
      ]);
      
      setSummary(summaryData);
      setBuildings(buildingsData);
      setAnomalies(anomaliesData);
    } catch (error) {
      console.error('Error loading energy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      const data = await getEnergyTimeSeries(selectedBuilding, timeRange);
      setChartData(Array.isArray(data) ? data : data.data);
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  const anomalyColumns = [
    {
      header: 'Building',
      accessor: 'building'
    },
    {
      header: 'Location',
      accessor: 'location'
    },
    {
      header: 'Time',
      accessor: 'timestamp',
      render: (value) => new Date(value).toLocaleTimeString()
    },
    {
      header: 'Consumption',
      accessor: 'consumption',
      render: (value) => `${value.toLocaleString()} kWh`
    },
    {
      header: 'Deviation',
      accessor: 'deviation',
      render: (value, row) => (
        <span className={`table-badge ${row.severity === 'high' ? 'danger' : row.severity === 'medium' ? 'warning' : 'info'}`}>
          {value}
        </span>
      )
    },
    {
      header: 'Severity',
      accessor: 'severity',
      render: (value) => (
        <span className={`table-badge ${value === 'high' ? 'danger' : value === 'medium' ? 'warning' : 'success'}`}>
          {value}
        </span>
      )
    }
  ];

  if (loading) {
    return <div className="loading-page">Loading energy data...</div>;
  }

  return (
    <div className="energy-page">
      <div className="page-header">
        <h1 className="page-title">Energy Monitoring</h1>
        <p className="page-subtitle">Real-time energy consumption tracking and analysis</p>
      </div>

      {/* Summary Cards */}
      <div className="energy-grid">
        <InfoCard
          title="Total Consumption"
          value={`${summary.totalConsumption.toLocaleString()} kWh`}
          icon={<i className="fas fa-bolt"></i>}
          subtitle="Last 24 hours"
          color="primary"
        />
        
        <InfoCard
          title="Total Cost"
          value={`$${summary.totalCost.toLocaleString()}`}
          icon={<i className="fas fa-dollar-sign"></i>}
          subtitle="Estimated billing"
          color="success"
        />
        
        <InfoCard
          title="Efficiency Score"
          value={`${summary.avgEfficiency}%`}
          icon={<i className="fas fa-chart-bar"></i>}
          subtitle="Campus average"
          trend="up"
          trendValue="+3%"
          color="info"
        />
        
        <InfoCard
          title="Anomalies Detected"
          value={summary.anomalyCount}
          icon={<i className="fas fa-exclamation-triangle"></i>}
          subtitle="Requires attention"
          color="warning"
        />
      </div>

      {/* Energy Chart Section */}
      <div className="energy-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Energy Consumption Trends</h2>
            <div className="controls-group">
              <select 
                className="control-select"
                value={selectedBuilding || ''}
                onChange={(e) => setSelectedBuilding(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">All Buildings</option>
                {buildings.map(building => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
              
              <div className="time-range-buttons">
                <button 
                  className={`time-btn ${timeRange === 'hourly' ? 'active' : ''}`}
                  onClick={() => setTimeRange('hourly')}
                >
                  Hourly
                </button>
                <button 
                  className={`time-btn ${timeRange === 'daily' ? 'active' : ''}`}
                  onClick={() => setTimeRange('daily')}
                >
                  Daily
                </button>
                <button 
                  className={`time-btn ${timeRange === 'weekly' ? 'active' : ''}`}
                  onClick={() => setTimeRange('weekly')}
                >
                  Weekly
                </button>
              </div>
            </div>
          </div>
          
          <LineChart data={chartData} height={300} />
        </div>
      </div>

      {/* Anomalies Table */}
      <div className="energy-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Energy Anomalies</h2>
            <span className="badge-count">{anomalies.length} detected</span>
          </div>
          
          <SimpleTable 
            columns={anomalyColumns}
            data={anomalies}
          />
        </div>
      </div>

      {/* Building Status Grid */}
      <div className="energy-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Building Status</h2>
          </div>
          
          <div className="building-grid">
            {buildings.map(building => (
              <div key={building.id} className="building-card">
                <div className="building-icon"><i className="fas fa-building"></i></div>
                <div className="building-name">{building.name}</div>
                <div className="building-status">
                  <span className="status-indicator status-normal"></span>
                  Normal
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Energy;
