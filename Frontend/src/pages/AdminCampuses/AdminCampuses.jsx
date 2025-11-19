import { useState, useEffect } from 'react';
import { getCampuses, createCampus, updateCampus, deleteCampus } from '../../api/campusApi';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Alert/Alert';
import './AdminCampuses.css';

const AdminCampuses = () => {
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampus, setEditingCampus] = useState(null);
  const [alert, setAlert] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    area_sqm: '',
    building_count: '',
    total_capacity: '',
    energy_baseline_kwh: '',
    status: 'active'
  });

  useEffect(() => {
    loadCampuses();
  }, []);

  const loadCampuses = async () => {
    setLoading(true);
    try {
      const data = await getCampuses();
      setCampuses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading campuses:', error);
      showAlert('No campus data available - Backend endpoint not implemented', 'error');
      setCampuses([]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleOpenModal = (campus = null) => {
    if (campus) {
      setEditingCampus(campus);
      setFormData({
        name: campus.name,
        location: campus.location,
        area_sqm: campus.area_sqm,
        building_count: campus.building_count,
        total_capacity: campus.total_capacity,
        energy_baseline_kwh: campus.energy_baseline_kwh,
        status: campus.status
      });
    } else {
      setEditingCampus(null);
      setFormData({
        name: '',
        location: '',
        area_sqm: '',
        building_count: '',
        total_capacity: '',
        energy_baseline_kwh: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCampus(null);
    setFormData({
      name: '',
      location: '',
      area_sqm: '',
      building_count: '',
      total_capacity: '',
      energy_baseline_kwh: '',
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
    
    if (!formData.name || !formData.location) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    try {
      if (editingCampus) {
        await updateCampus(editingCampus.campus_id, formData);
        showAlert('Campus updated successfully', 'success');
      } else {
        await createCampus(formData);
        showAlert('Campus created successfully', 'success');
      }
      handleCloseModal();
      loadCampuses();
    } catch (error) {
      showAlert(error.message || 'Backend endpoint not implemented. Contact backend team.', 'error');
    }
  };

  const handleDelete = async (campusId, campusName) => {
    if (window.confirm(`Are you sure you want to delete "${campusName}"?`)) {
      try {
        await deleteCampus(campusId);
        showAlert('Campus deleted successfully', 'success');
        loadCampuses();
      } catch (error) {
        showAlert(error.message || 'Backend endpoint not implemented. Contact backend team.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-campuses-page">
        <div className="loading-state">Loading campuses...</div>
      </div>
    );
  }

  return (
    <div className="admin-campuses-page">
      {alert && <Alert message={alert.message} type={alert.type} />}
      
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Campus Management</h1>
          <p className="page-subtitle">Manage campus locations and energy monitoring infrastructure</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <i className="fas fa-plus"></i>
          Add Campus
        </button>
      </div>

      <div className="campuses-grid">
        {campuses.map((campus) => (
          <div key={campus.campus_id} className="campus-card">
            <div className="campus-card-header">
              <div className="campus-info">
                <h3 className="campus-name">{campus.name}</h3>
                <p className="campus-location">
                  <i className="fas fa-map-marker-alt"></i>
                  {campus.location}
                </p>
              </div>
              <span className={`status-badge status-${campus.status}`}>
                {campus.status}
              </span>
            </div>

            <div className="campus-stats">
              <div className="stat-item">
                <i className="fas fa-building"></i>
                <div className="stat-info">
                  <span className="stat-label">Buildings</span>
                  <span className="stat-value">{campus.building_count}</span>
                </div>
              </div>
              <div className="stat-item">
                <i className="fas fa-users"></i>
                <div className="stat-info">
                  <span className="stat-label">Capacity</span>
                  <span className="stat-value">{campus.total_capacity.toLocaleString()}</span>
                </div>
              </div>
              <div className="stat-item">
                <i className="fas fa-expand-arrows-alt"></i>
                <div className="stat-info">
                  <span className="stat-label">Area</span>
                  <span className="stat-value">{campus.area_sqm.toLocaleString()} m²</span>
                </div>
              </div>
              <div className="stat-item">
                <i className="fas fa-bolt"></i>
                <div className="stat-info">
                  <span className="stat-label">Energy Baseline</span>
                  <span className="stat-value">{campus.energy_baseline_kwh.toLocaleString()} kWh</span>
                </div>
              </div>
            </div>

            <div className="campus-card-footer">
              <button 
                className="btn-edit" 
                onClick={() => handleOpenModal(campus)}
              >
                <i className="fas fa-edit"></i>
                Edit
              </button>
              <button 
                className="btn-delete" 
                onClick={() => handleDelete(campus.campus_id, campus.name)}
              >
                <i className="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
        ))}

        {campuses.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-university"></i>
            <h3>No Campuses Found</h3>
            <p>Get started by adding your first campus</p>
            <button className="btn-primary" onClick={() => handleOpenModal()}>
              <i className="fas fa-plus"></i>
              Add Campus
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={handleCloseModal} title={editingCampus ? 'Edit Campus' : 'Add New Campus'}>
        <form onSubmit={handleSubmit} className="campus-form">
          <div className="form-group">
            <label htmlFor="name">Campus Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Main Campus"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Karachi, Pakistan"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="area_sqm">Area (m²)</label>
              <input
                type="number"
                id="area_sqm"
                name="area_sqm"
                value={formData.area_sqm}
                onChange={handleInputChange}
                placeholder="50000"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="building_count">Building Count</label>
              <input
                type="number"
                id="building_count"
                name="building_count"
                value={formData.building_count}
                onChange={handleInputChange}
                placeholder="5"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="total_capacity">Total Capacity</label>
              <input
                type="number"
                id="total_capacity"
                name="total_capacity"
                value={formData.total_capacity}
                onChange={handleInputChange}
                placeholder="5000"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="energy_baseline_kwh">Energy Baseline (kWh)</label>
              <input
                type="number"
                id="energy_baseline_kwh"
                name="energy_baseline_kwh"
                value={formData.energy_baseline_kwh}
                onChange={handleInputChange}
                placeholder="45000"
                min="0"
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
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingCampus ? 'Update Campus' : 'Create Campus'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCampuses;
