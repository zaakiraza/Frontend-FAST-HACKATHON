import { useEffect, useState } from 'react';
import InfoCard from '../../components/Cards/InfoCard';
import SimpleTable from '../../components/Tables/SimpleTable';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Alert/Alert';
import { getMaintenanceSummary, getAllTickets, createTicket } from '../../api/maintenanceApi';
import './Maintenance.css';

const Maintenance = () => {
  const [summary, setSummary] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    building: '',
    location: '',
    priority: 'medium',
    description: '',
    reportedBy: 'Admin User'
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadTicketsData();
  }, [filter]);

  const loadInitialData = async () => {
    try {
      const summaryData = await getMaintenanceSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading maintenance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTicketsData = async () => {
    try {
      const ticketsData = await getAllTickets(filter);
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
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
    
    try {
      const newTicket = await createTicket(formData);
      setTickets(prev => [newTicket, ...prev]);
      setSummary(prev => ({
        ...prev,
        openTickets: prev.openTickets + 1
      }));
      
      setShowModal(false);
      setAlert({
        type: 'success',
        message: `Ticket ${newTicket.id} created successfully!`
      });
      
      // Reset form
      setFormData({
        title: '',
        building: '',
        location: '',
        priority: 'medium',
        description: '',
        reportedBy: 'Admin User'
      });
      
      // Auto-dismiss alert
      setTimeout(() => setAlert(null), 5000);
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Failed to create ticket. Please try again.'
      });
    }
  };

  const ticketColumns = [
    {
      header: 'Ticket ID',
      accessor: 'id',
      render: (row) => (
        <span className="ticket-id">{row.id}</span>
      )
    },
    {
      header: 'Title',
      accessor: 'title'
    },
    {
      header: 'Building',
      accessor: 'building'
    },
    {
      header: 'Location',
      accessor: 'location'
    },
    {
      header: 'Priority',
      accessor: 'priority',
      render: (row) => (
        <span className={`table-badge ${
          row.priority === 'high' ? 'danger' : 
          row.priority === 'medium' ? 'warning' : 'info'
        }`}>
          {row.priority}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`table-badge ${
          row.status === 'open' ? 'warning' : 
          row.status === 'in-progress' ? 'info' : 'success'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Reported By',
      accessor: 'reportedBy',
      render: (row) => (
        <span className={`reported-by ${row.reportedBy === 'System' ? 'system-badge' : ''}`}>
          {row.reportedBy}
        </span>
      )
    },
    {
      header: 'Assigned To',
      accessor: 'assignedTo'
    }
  ];

  if (loading) {
    return <div className="loading-page">Loading maintenance data...</div>;
  }

  return (
    <div className="maintenance-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Maintenance Tracking</h1>
          <p className="page-subtitle">Manage maintenance requests and track progress</p>
        </div>
        <button className="btn-create" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> Create Ticket
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          dismissible
          onDismiss={() => setAlert(null)}
        />
      )}

      {/* Summary Cards */}
      <div className="maintenance-grid">
        <InfoCard
          title="Open Tickets"
          value={summary.openTickets}
          icon={<i className="fas fa-clipboard-list"></i>}
          subtitle="Pending action"
          color="warning"
        />
        
        <InfoCard
          title="In Progress"
          value={summary.inProgress}
          icon={<i className="fas fa-cog"></i>}
          subtitle="Being worked on"
          color="info"
        />
        
        <InfoCard
          title="Resolved"
          value={summary.resolved}
          icon={<i className="fas fa-check-circle"></i>}
          subtitle="This month"
          trend="up"
          trendValue="+12%"
          color="success"
        />
        
        <InfoCard
          title="Avg Response Time"
          value={summary.avgResponseTime}
          icon={<i className="fas fa-clock"></i>}
          subtitle="Last 30 days"
          trend="down"
          trendValue="-15%"
          color="primary"
        />
      </div>

      {/* Tickets Table */}
      <div className="maintenance-section">
        <div className="section-card">
          <div className="section-header">
            <h2 className="section-title">Maintenance Tickets</h2>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All ({tickets.length})
              </button>
              <button 
                className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
                onClick={() => setFilter('open')}
              >
                Open
              </button>
              <button 
                className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
                onClick={() => setFilter('in-progress')}
              >
                In Progress
              </button>
              <button 
                className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
                onClick={() => setFilter('resolved')}
              >
                Resolved
              </button>
            </div>
          </div>
          
          <SimpleTable 
            columns={ticketColumns}
            data={tickets}
          />
        </div>
      </div>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Maintenance Ticket"
        size="medium"
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Brief description of the issue"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Building *</label>
              <select
                name="building"
                className="form-select"
                value={formData.building}
                onChange={handleInputChange}
                required
              >
                <option value="">Select building</option>
                <option value="Main Academic Building">Main Academic Building</option>
                <option value="Engineering Complex">Engineering Complex</option>
                <option value="Science Labs">Science Labs</option>
                <option value="Student Center">Student Center</option>
                <option value="Library">Library</option>
                <option value="Sports Complex">Sports Complex</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Floor 3, Room 301"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Priority *</label>
            <select
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleInputChange}
              required
            >
              <option value="low">Low - Can wait</option>
              <option value="medium">Medium - Normal priority</option>
              <option value="high">High - Urgent attention needed</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed description of the issue"
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Maintenance;
