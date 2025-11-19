import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/apiConfig';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Alert/Alert';
import SimpleTable from '../../components/Tables/SimpleTable';
import './AdminBuildings.css';

const AdminBuildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    campus: 'all',
    status: 'all'
  });
  const [formData, setFormData] = useState({
    campus_id: '',
    building_name: '',
    building_code: '',
    floor_count: '',
    total_capacity: '',
    status: 'active'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Use existing energy/buildings endpoint for buildings data
      const buildingsRes = await fetch(`${API_BASE_URL}/energy/buildings`);
      const buildingsData = await buildingsRes.json();
      
      // Campus data not available - no endpoint exists
      const buildings = Array.isArray(buildingsData) ? buildingsData : buildingsData.data || [];
      
      setBuildings(buildings);
      setCampuses([]); // No campus endpoint available
    } catch (error) {
      console.error('Error loading data:', error);
      showAlert('Failed to load buildings data', 'error');
      setBuildings([]);
      setCampuses([]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleOpenModal = (building = null) => {
    if (building) {
      setEditingBuilding(building);
      setFormData({
        campus_id: building.campus_id || '',
        building_name: building.building_name || '',
        building_code: building.building_code || '',
        floor_count: building.floor_count || '',
        total_capacity: building.total_capacity || '',
        status: building.status || 'active'
      });
    } else {
      setEditingBuilding(null);
      setFormData({
        campus_id: '',
        building_name: '',
        building_code: '',
        floor_count: '',
        total_capacity: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBuilding(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.building_name || !formData.building_code) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    // Backend doesn't have admin/buildings CRUD endpoints yet
    showAlert('Building creation/update not implemented on backend. Contact backend team.', 'error');
  };

  const handleDelete = async (buildingId, buildingName) => {
    if (window.confirm(`Are you sure you want to delete "${buildingName}"?`)) {
      // Backend doesn't have admin/buildings DELETE endpoint yet
      showAlert('Building deletion not implemented on backend. Contact backend team.', 'error');
    }
  };

  const filteredBuildings = buildings.filter(building => {
    // Since energy/buildings API doesn't return status field, assume all are active
    // Filter would work if status field is added to backend response
    const buildingStatus = building.status || 'active';
    if (filters.status !== 'all' && buildingStatus !== filters.status) return false;
    return true;
  });

  const tableColumns = [
    { 
      key: 'name', 
      label: 'Building Name',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'id', 
      label: 'Building ID',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'energy_consumption', 
      label: 'Energy (kWh)',
      render: (value) => value ? value.toLocaleString() : 'N/A'
    },
    { 
      key: 'efficiency_score', 
      label: 'Efficiency',
      render: (value) => value ? `${value}%` : 'N/A'
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`table-badge status-${value || 'active'}`}>
          {value || 'active'}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions',
      render: (_, row) => (
        <div className="table-actions">
          <button 
            className="btn-icon btn-edit" 
            onClick={() => handleOpenModal(row)}
            title="Edit"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button 
            className="btn-icon btn-delete" 
            onClick={() => handleDelete(row.id, row.name)}
            title="Delete"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return <div className="loading">Loading buildings...</div>;
  }

  return (
    <div className="admin-buildings">
      {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <div className="page-header">
        <div className="header-content">
          <h1><i className="fas fa-building"></i> Building Management</h1>
          <p>Manage campus buildings and facilities</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <i className="fas fa-plus"></i> Add Building
        </button>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select 
            id="status-filter"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="filter-stats">
          <span className="stat-badge">
            <i className="fas fa-building"></i>
            {filteredBuildings.length} Buildings
          </span>
        </div>
      </div>

      <div className="table-container">
        <SimpleTable 
          columns={tableColumns}
          data={filteredBuildings}
        />
      </div>

      <Modal isOpen={showModal} onClose={handleCloseModal} title={editingBuilding ? 'Edit Building' : 'Add New Building'}>
        <form onSubmit={handleSubmit} className="building-form">
          <div className="alert alert-info">
            <i className="fas fa-info-circle"></i>
            Building creation/update requires backend admin endpoints
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="building_name">Building Name *</label>
              <input
                type="text"
                id="building_name"
                name="building_name"
                value={formData.building_name}
                onChange={handleInputChange}
                placeholder="e.g., Engineering Block"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="building_code">Building Code *</label>
              <input
                type="text"
                id="building_code"
                name="building_code"
                value={formData.building_code}
                onChange={handleInputChange}
                placeholder="e.g., ENG-A"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="floor_count">Floor Count</label>
              <input
                type="number"
                id="floor_count"
                name="floor_count"
                value={formData.floor_count}
                onChange={handleInputChange}
                min="1"
                placeholder="e.g., 5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="total_capacity">Total Capacity</label>
              <input
                type="number"
                id="total_capacity"
                name="total_capacity"
                value={formData.total_capacity}
                onChange={handleInputChange}
                min="0"
                placeholder="e.g., 1000"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled>
              <i className="fas fa-save"></i> {editingBuilding ? 'Update' : 'Create'} Building
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBuildings;
