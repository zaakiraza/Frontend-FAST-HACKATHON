import { useState, useEffect } from 'react';
import { getTickets, createTicket, updateTicket, deleteTicket } from '../../api/ticketApi';
import { getCampuses } from '../../api/campusApi';
import { getBuildings } from '../../api/buildingApi';
import { useAuth } from '../../context/AuthContext';
import PermissionGate from '../../components/PermissionGate/PermissionGate';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Alert/Alert';
import SimpleTable from '../../components/Tables/SimpleTable';
import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch';
import './AdminTickets.css';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
    category: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    campus_id: '',
    building_id: '',
    room_id: '',
    title: '',
    description: '',
    category: 'electrical',
    priority: 'medium',
    status: 'open',
    location: '',
    building: '',
    room: '',
    reported_by: '',
    assigned_to: '',
    estimated_cost: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ticketsData, campusesData, buildingsData] = await Promise.all([
        getTickets(),
        getCampuses(),
        getBuildings()
      ]);
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      const campusArray = Array.isArray(campusesData) ? campusesData : (campusesData?.data || []);
      setCampuses(campusArray);
      const buildingArray = Array.isArray(buildingsData) ? buildingsData : (buildingsData?.data || []);
      setBuildings(buildingArray);
      console.log('Loaded buildings:', buildingArray);
    } catch (error) {
      console.error('Error loading tickets:', error);
      showAlert('Failed to load tickets data', 'error');
      setTickets([]);
      setCampuses([]);
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleOpenModal = (ticket = null) => {
    if (ticket) {
      setEditingTicket(ticket);
      setFormData({
        campus_id: ticket.campus_id || '',
        building_id: ticket.building_id || '',
        room_id: ticket.room_id || '',
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        location: ticket.location,
        building: ticket.building_name || '',
        room: ticket.room_number || '',
        reported_by: ticket.reported_by,
        assigned_to: ticket.assigned_to || '',
        estimated_cost: ticket.estimated_cost || ''
      });
    } else {
      setEditingTicket(null);
      setFormData({
        campus_id: '',
        building_id: '',
        room_id: '',
        title: '',
        description: '',
        category: 'electrical',
        priority: 'medium',
        status: 'open',
        location: '',
        building: '',
        room: '',
        reported_by: '',
        assigned_to: '',
        estimated_cost: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTicket(null);
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
    
    if (!formData.title || !formData.description || !formData.priority || !formData.building_id) {
      showAlert('Please fill in title, description, priority, and building', 'error');
      return;
    }

    try {
      if (editingTicket) {
        showAlert('Update functionality not available in backend', 'error');
        return;
      } else {
        // Get building name for backend validation
        const selectedBuilding = buildings.find(b => 
          (b.uid || b.id) === parseInt(formData.building_id)
        );
        const buildingName = selectedBuilding?.name || selectedBuilding?.building_name || 'Unknown';
        
        // Prepare data for backend - backend validates 'building' but uses 'building_id'
        const ticketPayload = {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          category: formData.category,
          building: buildingName, // Backend validation requires this
          building_id: parseInt(formData.building_id), // Backend model uses this
          room_id: formData.room_id || null,
          location: formData.location,
          reportedBy: formData.reported_by || 'User',
          estimatedCost: formData.estimated_cost || 0
        };
        
        await createTicket(ticketPayload);
        showAlert('Ticket created successfully', 'success');
      }
      handleCloseModal();
      loadData();
    } catch (error) {
      showAlert(error.message || 'Failed to save ticket', 'error');
    }
  };

  const handleDelete = async (ticketId, ticketTitle) => {
    showAlert('Delete functionality not available in backend', 'error');
  };

  const handleSearch = ({ search, filters: searchFilters }) => {
    setFilters(prev => ({
      ...prev,
      search: search || '',
      priority: searchFilters.priority || 'all',
      status: searchFilters.status || 'all'
    }));
  };

  const filteredTickets = tickets.filter(ticket => {
    // Priority filter
    if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false;
    
    // Status filter
    if (filters.status !== 'all' && ticket.status !== filters.status) return false;
    
    // Category filter
    if (filters.category !== 'all' && ticket.category !== filters.category) return false;
    
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        ticket.title?.toLowerCase().includes(term) ||
        ticket.description?.toLowerCase().includes(term) ||
        ticket.location?.toLowerCase().includes(term) ||
        ticket.building?.toLowerCase().includes(term) ||
        ticket.room?.toLowerCase().includes(term) ||
        ticket.reported_by?.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  // const handleSearch = (term, activeFilters) => {
  //   setSearchTerm(term);
  //   setFilters(prev => ({
  //     ...prev,
  //     ...activeFilters
  //   }));
  // };

  const priorityIcons = {
    critical: 'fas fa-exclamation-circle',
    high: 'fas fa-arrow-up',
    medium: 'fas fa-minus',
    low: 'fas fa-arrow-down'
  };

  const tableColumns = [
    { 
      key: 'id', 
      label: 'TICKET ID',
      render: (value) => value || 'N/A'
    },
    { key: 'title', label: 'TITLE' },
    { key: 'building', label: 'BUILDING' },
    { key: 'location', label: 'LOCATION' },
    { 
      key: 'priority', 
      label: 'PRIORITY',
      render: (value) => (
        <span className={`table-badge priority-${value}`}>
          <i className={priorityIcons[value]}></i>
          {value?.toUpperCase()}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'STATUS',
      render: (value) => (
        <span className={`table-badge status-${value}`}>
          {value?.toUpperCase().replace('-', ' ')}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (_, row) => (
        <div className="table-actions">
          <button className="btn-icon btn-view" onClick={() => handleOpenModal(row)} title="View Details">
            <i className="fas fa-eye"></i>
          </button>
        </div>
      )
    }
  ];

  console.log(tableColumns);
  const stats = {
    total: filteredTickets.length,
    open: filteredTickets.filter(t => t.status === 'open').length,
    inProgress: filteredTickets.filter(t => t.status === 'in-progress').length,
    critical: filteredTickets.filter(t => t.priority === 'critical').length
  };

  if (loading) {
    return (
      <div className="admin-tickets-page">
        <div className="loading-state">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="admin-tickets-page">
      {alert && <Alert message={alert.message} type={alert.type} />}
      
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Maintenance Tickets</h1>
          <p className="page-subtitle">Create and track maintenance requests across campus facilities</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <i className="fas fa-plus"></i>
          Create Ticket
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Tickets</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
            <i className="fas fa-folder-open"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.open}</span>
            <span className="stat-label">Open</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
            <i className="fas fa-spinner"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.critical}</span>
            <span className="stat-label">Critical</span>
          </div>
        </div>
      </div>

      <AdvancedSearch
        onSearch={handleSearch}
        placeholder="Search tickets by title, location, building..."
        filters={[
          {
            key: 'priority',
            label: 'Priority',
            options: [
              { value: 'all', label: 'All Priorities' },
              { value: 'critical', label: 'Critical' },
              { value: 'high', label: 'High' },
              { value: 'medium', label: 'Medium' },
              { value: 'low', label: 'Low' }
            ]
          },
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'open', label: 'Open' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'closed', label: 'Closed' }
            ]
          },
          {
            key: 'category',
            label: 'Category',
            options: [
              { value: 'all', label: 'All Categories' },
              { value: 'electrical', label: 'Electrical' },
              { value: 'plumbing', label: 'Plumbing' },
              { value: 'hvac', label: 'HVAC' },
              { value: 'structural', label: 'Structural' },
              { value: 'equipment', label: 'Equipment' },
              { value: 'cleaning', label: 'Cleaning' },
              { value: 'security', label: 'Security' },
              { value: 'other', label: 'Other' }
            ]
          }
        ]}
      />

      <div className="filters-section">
        <div className="filter-stats">
          <span className="stat-badge">
            <i className="fas fa-ticket-alt"></i>
            {filteredTickets.length} Tickets
          </span>
        </div>
      </div>

      <div className="tickets-table-wrapper">
        <SimpleTable 
          columns={tableColumns}
          data={filteredTickets}
        />
      </div>

      <Modal isOpen={showModal} onClose={handleCloseModal} title={editingTicket ? 'View Ticket' : 'Create New Ticket'}>
        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Brief description of the issue"
              required
              disabled={editingTicket}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed description of the maintenance issue"
              rows="4"
              required
              disabled={editingTicket}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={editingTicket}
              >
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="hvac">HVAC</option>
                <option value="structural">Structural</option>
                <option value="equipment">Equipment</option>
                <option value="cleaning">Cleaning</option>
                <option value="security">Security</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority *</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                required
                disabled={editingTicket}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="building_id">Building *</label>
              <select
                id="building_id"
                name="building_id"
                value={formData.building_id}
                onChange={handleInputChange}
                required
                disabled={editingTicket}
              >
                <option value="">Select Building</option>
                {Array.isArray(buildings) && buildings.map(building => (
                  <option key={building.uid || building.id} value={building.uid || building.id}>
                    {building.name || building.building_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Floor 3, Room 301"
                disabled={editingTicket}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reported_by">Reported By</label>
              <input
                type="text"
                id="reported_by"
                name="reported_by"
                value={formData.reported_by}
                onChange={handleInputChange}
                placeholder="Name or ID"
                disabled={editingTicket}
              />
            </div>

            <div className="form-group">
              <label htmlFor="estimated_cost">Estimated Cost ($)</label>
              <input
                type="number"
                id="estimated_cost"
                name="estimated_cost"
                value={formData.estimated_cost}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
                disabled={editingTicket}
              />
            </div>
          </div>

          {editingTicket && (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={formData.status}
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="assigned_to">Assigned To</label>
                <input
                  type="text"
                  id="assigned_to"
                  name="assigned_to"
                  value={formData.assigned_to}
                  disabled
                />
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>
              {editingTicket ? 'Close' : 'Cancel'}
            </button>
            {!editingTicket && (
              <button type="submit" className="btn-primary">
                Create Ticket
              </button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTickets;
