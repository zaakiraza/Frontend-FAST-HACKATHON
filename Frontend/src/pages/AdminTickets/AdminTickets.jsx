import { useState, useEffect } from 'react';
import { getTickets, createTicket, updateTicket, deleteTicket, getCampuses } from '../../api/ticketApi';
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
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    priority: 'all',
    status: 'all',
<<<<<<< HEAD
    search: ''
=======
    category: 'all'
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
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
      const [ticketsData, campusesData] = await Promise.all([
        getTickets(),
        getCampuses()
      ]);
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      setCampuses(Array.isArray(campusesData) ? campusesData : []);
    } catch (error) {
      console.error('Error loading tickets:', error);
      showAlert('Failed to load tickets data', 'error');
      setTickets([]);
      setCampuses([]);
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
    
    if (!formData.campus_id || !formData.title || !formData.description) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    try {
      if (editingTicket) {
        await updateTicket(editingTicket.ticket_id, formData);
        showAlert('Ticket updated successfully', 'success');
      } else {
        await createTicket(formData);
        showAlert('Ticket created successfully', 'success');
      }
      handleCloseModal();
      loadData();
    } catch (error) {
      showAlert('Failed to save ticket', 'error');
    }
  };

  const handleDelete = async (ticketId, ticketTitle) => {
    if (window.confirm(`Are you sure you want to delete ticket "${ticketTitle}"?`)) {
      try {
        await deleteTicket(ticketId);
        showAlert('Ticket deleted successfully', 'success');
        loadData();
      } catch (error) {
        showAlert('Failed to delete ticket', 'error');
      }
    }
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
<<<<<<< HEAD
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        ticket.id?.toLowerCase().includes(searchLower) ||
        ticket.title?.toLowerCase().includes(searchLower) ||
        ticket.building?.toLowerCase().includes(searchLower) ||
        ticket.location?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
=======
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
    // Priority filter
    if (filters.priority !== 'all' && ticket.priority !== filters.priority) return false;
    
    // Status filter
    if (filters.status !== 'all' && ticket.status !== filters.status) return false;
    
<<<<<<< HEAD
=======
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
    
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
    return true;
  });

  const handleSearch = (term, activeFilters) => {
    setSearchTerm(term);
    setFilters(prev => ({
      ...prev,
      ...activeFilters
    }));
  };

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
      render: (value) => value || '#undefined'
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
          <button className="btn-icon btn-edit" onClick={() => handleOpenModal(row)} title="Edit">
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn-icon btn-delete" onClick={() => handleDelete(row.id, row.title)} title="Delete">
            <i className="fas fa-trash"></i>
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
<<<<<<< HEAD
        placeholder="Search tickets by ID, title, building, or location..."
=======
        placeholder="Search tickets by title, location, building..."
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
        filters={[
          {
            key: 'priority',
            label: 'Priority',
            options: [
<<<<<<< HEAD
=======
              { value: 'all', label: 'All Priorities' },
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
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
<<<<<<< HEAD
=======
              { value: 'all', label: 'All Status' },
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7
              { value: 'open', label: 'Open' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'resolved', label: 'Resolved' },
              { value: 'closed', label: 'Closed' }
            ]
<<<<<<< HEAD
          }
        ]}
      />
=======
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
>>>>>>> 70f455bc589ab8d18791203d7b70203371692ab7

      <div className="tickets-table-wrapper">
        <SimpleTable 
          columns={tableColumns}
          data={filteredTickets}
        />
      </div>

      <Modal isOpen={showModal} onClose={handleCloseModal} title={editingTicket ? 'Edit Ticket' : 'Create New Ticket'}>
        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label htmlFor="campus_id">Campus *</label>
            <select
              id="campus_id"
              name="campus_id"
              value={formData.campus_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Campus</option>
              {campuses.map(campus => (
                <option key={campus.campus_id} value={campus.campus_id}>
                  {campus.name}
                </option>
              ))}
            </select>
          </div>

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
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
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
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
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
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Building A, 3rd Floor"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="building">Building</label>
              <input
                type="text"
                id="building"
                name="building"
                value={formData.building}
                onChange={handleInputChange}
                placeholder="Building A"
              />
            </div>

            <div className="form-group">
              <label htmlFor="room">Room</label>
              <input
                type="text"
                id="room"
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                placeholder="Room 301"
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
              />
            </div>

            <div className="form-group">
              <label htmlFor="assigned_to">Assigned To</label>
              <input
                type="text"
                id="assigned_to"
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleInputChange}
                placeholder="Technician name"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingTicket ? 'Update Ticket' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTickets;
