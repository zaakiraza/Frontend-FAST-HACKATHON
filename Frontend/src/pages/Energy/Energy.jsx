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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAnomalies, setTotalAnomalies] = useState(0);

  // Helper function to format numbers with units (K, M, B)
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    const parsedNum = parseFloat(num);
    if (isNaN(parsedNum)) return '0';
    const absNum = Math.abs(parsedNum);
    if (absNum >= 1000000000) {
      return (parsedNum / 1000000000).toFixed(1) + 'B';
    } else if (absNum >= 1000000) {
      return (parsedNum / 1000000).toFixed(1) + 'M';
    } else if (absNum >= 1000) {
      return (parsedNum / 1000).toFixed(1) + 'K';
    }
    return parsedNum.toFixed(0);
  };

  useEffect(() => {
    loadInitialData();
    
    // Auto-refresh summary and anomalies every 10 seconds
    const interval = setInterval(() => {
      loadInitialData();
    }, 10000);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [currentPage]);

  useEffect(() => {
    loadChartData();
    
    // Auto-refresh chart data every 10 seconds
    const chartInterval = setInterval(() => {
      loadChartData();
    }, 10000);
    
    // Cleanup interval on unmount
    return () => clearInterval(chartInterval);
  }, [selectedBuilding, timeRange]);

  const loadInitialData = async () => {
    try {
      const [summaryData, buildingsData, anomaliesData] = await Promise.all([
        getEnergySummary(),
        getBuildings(),
        getEnergyAnomalies(currentPage, 10)
      ]);
      
      setSummary(summaryData);
      
      // Ensure buildings is always an array
      if (Array.isArray(buildingsData)) {
        setBuildings(buildingsData);
      } else if (buildingsData && buildingsData.data && Array.isArray(buildingsData.data)) {
        setBuildings(buildingsData.data);
      } else {
        setBuildings([]);
      }
      
      // Handle paginated anomalies response
      if (anomaliesData && typeof anomaliesData === 'object') {
        // Check for pagination object (new backend format)
        if (anomaliesData.pagination) {
          setAnomalies(anomaliesData.data || []);
          setTotalAnomalies(anomaliesData.pagination.total || 0);
          setTotalPages(anomaliesData.pagination.totalPages || 1);
        }
        // Check for data array with pagination info
        else if (Array.isArray(anomaliesData)) {
          setAnomalies(anomaliesData);
          setTotalAnomalies(anomaliesData.length);
          setTotalPages(1);
        } else if (anomaliesData.data && Array.isArray(anomaliesData.data)) {
          setAnomalies(anomaliesData.data);
          setTotalAnomalies(anomaliesData.total || anomaliesData.data.length);
          setTotalPages(anomaliesData.totalPages || Math.ceil((anomaliesData.total || anomaliesData.data.length) / 10));
        } else if (anomaliesData.anomalies && Array.isArray(anomaliesData.anomalies)) {
          setAnomalies(anomaliesData.anomalies);
          setTotalAnomalies(anomaliesData.total || anomaliesData.anomalies.length);
          setTotalPages(anomaliesData.totalPages || Math.ceil((anomaliesData.total || anomaliesData.anomalies.length) / 10));
        } else {
          setAnomalies([]);
          setTotalAnomalies(0);
          setTotalPages(1);
        }
      } else {
        setAnomalies([]);
        setTotalAnomalies(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading energy data:', error);
      setBuildings([]);
      setAnomalies([]);
      setTotalAnomalies(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      console.log('Loading chart data with:', { selectedBuilding, timeRange });
      const response = await getEnergyTimeSeries(selectedBuilding, timeRange);
      console.log('Chart data received:', response);
      
      // Backend returns { building: "name", data: [...] } when building is selected
      // or just [...] when all buildings
      let data = [];
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          data = response;
        } else if (response.data && Array.isArray(response.data)) {
          data = response.data;
        } else if (response.success && response.data) {
          data = Array.isArray(response.data) ? response.data : [];
        }
      }
      
      console.log('Processed chart data:', data);
      setChartData(data);
    } catch (error) {
      console.error('Error loading chart data:', error);
      // Set empty array instead of showing error
      setChartData([]);
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
      render: (value) => new Date(value).toLocaleString()
    },
    {
      header: 'Consumption',
      accessor: 'consumption',
      render: (value) => `${formatNumber(value)} kWh`
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (value) => value ? value.replace('_', ' ').toUpperCase() : 'N/A'
    },
    {
      header: 'Severity',
      accessor: 'severity',
      render: (value) => (
        <span className={`table-badge ${value === 'critical' || value === 'high' ? 'danger' : value === 'medium' ? 'warning' : 'success'}`}>
          {value}
        </span>
      )
    }
  ];

  if (loading) {
    return <div className="loading-page">Loading energy data...</div>;
  }

  if (!summary) {
    return <div className="loading-page">No energy data available</div>;
  }

  return (
    <div className="energy-page">
      <div className="page-header">
        <h1 className="page-title">Energy Monitoring</h1>
        <p className="page-subtitle">Real-time energy consumption tracking and analysis</p>
      </div>

      <div className="energy-grid">
        <InfoCard
          title="Total Consumption"
          value={`${formatNumber(summary.totalConsumption || 0)} kWh`}
          icon={<i className="fas fa-bolt"></i>}
          subtitle="Last 24 hours"
          color="primary"
        />
        
        <InfoCard
          title="Total Cost"
          value={`Rs ${formatNumber(summary.totalCost || 0)}`}
          icon={<i className="fas fa-dollar-sign"></i>}
          subtitle="Estimated billing"
          color="success"
        />
        
        <InfoCard
          title="Efficiency Score"
          value={`${(summary.avgEfficiency || 0).toFixed(1)}%`}
          icon={<i className="fas fa-chart-bar"></i>}
          subtitle="Campus average"
          trend="up"
          trendValue="+3%"
          color="info"
        />
        
        <InfoCard
          title="Anomalies Detected"
          value={summary.anomalyCount || 0}
          icon={<i className="fas fa-exclamation-triangle"></i>}
          subtitle="Requires attention"
          color="warning"
        />
      </div>

      <div className="energy-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Energy Consumption Trends</h2>
            <div className="controls-group">
              <select 
                className="control-select"
                value={selectedBuilding || 'all'}
                onChange={(e) => setSelectedBuilding(e.target.value === 'all' ? null : e.target.value)}
              >
                <option value="all">All Buildings</option>
                {Array.isArray(buildings) && buildings.map(building => (
                  <option key={building.uid || building.id} value={building.uid || building.id}>
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
                  className={`time-btn ${timeRange === 'monthly' ? 'active' : ''}`}
                  onClick={() => setTimeRange('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
          </div>
          
          <LineChart data={chartData} height={300} />
        </div>
      </div>

      <div className="energy-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Energy Anomalies</h2>
            <span className="badge-count">{totalAnomalies} total</span>
          </div>
          
          <SimpleTable 
            columns={anomalyColumns}
            data={anomalies}
          />
          
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i> Previous
            </button>
            
            <span className="pagination-info">
              Page {currentPage} of {totalPages} ({totalAnomalies} total)
            </span>
            
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="energy-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Building Status</h2>
          </div>
          
          <div className="building-grid">
            {Array.isArray(buildings) && buildings.map(building => (
              <div key={building.uid || building.id} className="building-card">
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
