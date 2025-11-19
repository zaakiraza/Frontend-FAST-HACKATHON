import { useEffect, useState } from 'react';
import InfoCard from '../../components/Cards/InfoCard';
import SimpleTable from '../../components/Tables/SimpleTable';
import { getSpaceSummary, getSpaceOccupancy, getSpaceHeatmap, getSpaceSuggestions } from '../../api/spaceApi';
import './Space.css';

const Space = () => {
  const [summary, setSummary] = useState(null);
  const [occupancy, setOccupancy] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadOccupancyData();
  }, [filter]);

  const loadInitialData = async () => {
    try {
      const [summaryData, heatmapData, suggestionsData] = await Promise.all([
        getSpaceSummary(),
        getSpaceHeatmap(),
        getSpaceSuggestions()
      ]);
      
      setSummary(summaryData);
      setHeatmap(heatmapData);
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Error loading space data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOccupancyData = async () => {
    try {
      const data = await getSpaceOccupancy(filter);
      console.log('Occupancy data:', data);
      setOccupancy(data);
    } catch (error) {
      console.error('Error loading occupancy data:', error);
    }
  };

  const occupancyColumns = [
    {
      header: 'Room',
      accessor: 'room'
    },
    {
      header: 'Building',
      accessor: 'building'
    },
    {
      header: 'Capacity',
      accessor: 'capacity'
    },
    {
      header: 'Current',
      accessor: 'current'
    },
    {
      header: 'Utilization',
      accessor: 'percentage',
      render: (value, row) => (
        <div className="utilization-cell">
          <span>{value}%</span>
          <div className="progress-bar">
            <div 
              className={`progress-fill progress-${row.status}`}
              style={{ width: `${Math.min(value, 100)}%` }}
            ></div>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`table-badge ${
          value === 'overcapacity' ? 'danger' : 
          value === 'optimal' ? 'success' : 
          value === 'underutilized' ? 'warning' : 'info'
        }`}>
          {value}
        </span>
      )
    }
  ];

  if (loading) {
    return <div className="loading-page">Loading space data...</div>;
  }

  return (
    <div className="space-page">
      <div className="page-header">
        <h1 className="page-title">Space Utilization</h1>
        <p className="page-subtitle">Monitor and optimize campus space usage</p>
      </div>

      <div className="space-grid">
        <InfoCard
          title="Total Rooms"
          value={summary.totalRooms}
          icon={<i className="fas fa-building"></i>}
          subtitle="Campus-wide"
          color="primary"
        />
        
        <InfoCard
          title="Occupied"
          value={summary.occupied}
          icon={<i className="fas fa-users"></i>}
          subtitle={`${Math.round((summary.occupied / summary.totalRooms) * 100)}% utilization`}
          color="success"
        />
        
        <InfoCard
          title="Available"
          value={summary.available}
          icon={<i className="fas fa-check-circle"></i>}
          subtitle="Ready for use"
          color="info"
        />
        
        <InfoCard
          title="Over Capacity"
          value={summary.overCapacity}
          icon={<i className="fas fa-exclamation-triangle"></i>}
          subtitle="Requires attention"
          color="danger"
        />
      </div>

      <div className="space-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Campus Heatmap</h2>
            <div className="legend">
              <span className="legend-item">
                <span className="legend-color legend-available"></span> Available
              </span>
              <span className="legend-item">
                <span className="legend-color legend-underutilized"></span> Under-utilized
              </span>
              <span className="legend-item">
                <span className="legend-color legend-optimal"></span> Optimal
              </span>
              <span className="legend-item">
                <span className="legend-color legend-overcapacity"></span> Over-capacity
              </span>
            </div>
          </div>
          
          <div className="heatmap-grid">
            {heatmap.slice(0, 40).map(room => (
              <div 
                key={room.id} 
                className={`heatmap-cell heatmap-${room.status}`}
                title={`${room.name}: ${room.occupancy}/${room.capacity}`}
              >
                <span className="cell-label">{room.id.split('-')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Room Occupancy Details</h2>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filter === 'overcapacity' ? 'active' : ''}`}
                onClick={() => setFilter('overcapacity')}
              >
                Over-capacity
              </button>
              <button 
                className={`filter-btn ${filter === 'optimal' ? 'active' : ''}`}
                onClick={() => setFilter('optimal')}
              >
                Optimal
              </button>
              <button 
                className={`filter-btn ${filter === 'underutilized' ? 'active' : ''}`}
                onClick={() => setFilter('underutilized')}
              >
                Under-utilized
              </button>
            </div>
          </div>
          
          <SimpleTable 
            columns={occupancyColumns}
            data={occupancy}
          />
        </div>
      </div>

      <div className="space-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Optimization Suggestions</h2>
            <span className="badge-count">{suggestions.length} suggestions</span>
          </div>
          
          <div className="suggestions-grid">
            {suggestions.map(suggestion => (
              <div key={suggestion.id} className="suggestion-card">
                <div className="suggestion-header">
                  <span className={`suggestion-type type-${suggestion.type}`}>
                    {suggestion.type}
                  </span>
                  <span className={`suggestion-impact impact-${suggestion.impact.toLowerCase()}`}>
                    {suggestion.impact} Impact
                  </span>
                </div>
                <h3 className="suggestion-title">{suggestion.title}</h3>
                <p className="suggestion-description">{suggestion.description}</p>
                <div className="suggestion-footer">
                  <span className="suggestion-savings">💰 {suggestion.savings}</span>
                  <button className="btn-suggestion">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Space;
