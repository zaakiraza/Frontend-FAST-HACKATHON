import { useState, useEffect } from 'react';
import { getBuildings, createBuilding, updateBuilding, deleteBuilding, getCampuses } from '../../api/buildingApi';
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
    campus_uid: '',
    name: '',
    code: '',
    totalRooms: '',
    totalCapacity: '',
    status: 'active'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [buildingsData, campusesData] = await Promise.all([
        getBuildings(),
        getCampuses().catch(() => [])
      ]);
      
      setBuildings(Array.isArray(buildingsData) ? buildingsData : buildingsData.data || []);
      setCampuses(Array.isArray(campusesData) ? campusesData : []);
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
        campus_uid: building.campus_uid || building.campus_id || '',
        name: building.name || '',
        code: building.code || '',
        totalRooms: building.totalRooms || '',
        totalCapacity: building.totalCapacity || '',
        status: building.status || 'active'
      });
    } else {
      setEditingBuilding(null);
      setFormData({
        campus_uid: campuses.length > 0 ? (campuses[0].uid || campuses[0].id || '') : '',
        name: '',
        code: '',
        totalRooms: '',
        totalCapacity: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBuilding(null);
    setFormData({
      campus_uid: campuses.length > 0 ? (campuses[0].uid || campuses[0].id || '') : '',
      name: '',
      code: '',
      totalRooms: '',
      totalCapacity: '',
      status: 'active'
    });
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
    
    if (!formData.name || !formData.code || !formData.campus_uid) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    try {
      if (editingBuilding) {
        await updateBuilding(editingBuilding.uid, formData);
        showAlert('Building updated successfully', 'success');
      } else {
        await createBuilding(formData);
        showAlert('Building created successfully', 'success');
      }
      handleCloseModal();
      loadData();
    } catch (error) {
      showAlert(error.message || 'Failed to save building', 'error');
    }
  };

  const handleDelete = async (buildingId, buildingName) => {
    if (window.confirm(`Are you sure you want to delete "${buildingName}"?`)) {
      try {
        await deleteBuilding(buildingId);
        showAlert('Building deleted successfully', 'success');
        loadData();
      } catch (error) {
        showAlert(error.message || 'Failed to delete building', 'error');
      }
    }
  };

  const filteredBuildings = buildings.filter(building => {
    // Campus filter using campus_uid
    if (filters.campus !== 'all' && building.campus_uid && building.campus_uid !== filters.campus) return false;
    
    // Status filter
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
      key: 'code', 
      label: 'Building Code',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'campusName', 
      label: 'Campus',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'totalRooms', 
      label: 'Total Rooms',
      render: (value) => value || 0
    },
    { 
      key: 'totalCapacity', 
      label: 'Capacity',
      render: (value) => value ? value.toLocaleString() : 0
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
            onClick={() => handleDelete(row.uid, row.name)}
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
        <PermissionGate permissions={["space.view", "maintenance.create"]} requireAll={false}>
          <button className="btn-primary" onClick={() => handleOpenModal()}>
            <i className="fas fa-plus"></i> Add Building
          </button>
        </PermissionGate>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="campus-filter">Campus</label>
          <select 
            id="campus-filter"
            value={filters.campus}
            onChange={(e) => setFilters(prev => ({ ...prev, campus: e.target.value }))}
          >
            <option value="all">All Campuses</option>
            {campuses.map(campus => (
              <option key={campus.uid || campus.campus_id || campus.id} value={(campus.uid || campus.campus_id || campus.id)?.toString()}>
                {campus.name}
              </option>
            ))}
          </select>
        </div>

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
          <div className="form-group">
            <label htmlFor="campus_uid">Campus *</label>
            <select
              id="campus_uid"
              name="campus_uid"
              value={formData.campus_uid}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Campus</option>
              {campuses.map(campus => (
                <option key={campus.uid || campus.id} value={campus.uid || campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Building Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Engineering Block"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="code">Building Code *</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="e.g., ENG-A"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="totalRooms">Total Rooms</label>
              <input
                type="number"
                id="totalRooms"
                name="totalRooms"
                value={formData.totalRooms}
                onChange={handleInputChange}
                min="0"
                placeholder="e.g., 20"
              />
            </div>

            <div className="form-group">
              <label htmlFor="totalCapacity">Total Capacity</label>
              <input
                type="number"
                id="totalCapacity"
                name="totalCapacity"
                value={formData.totalCapacity}
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
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i> {editingBuilding ? 'Update' : 'Create'} Building
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBuildings;
