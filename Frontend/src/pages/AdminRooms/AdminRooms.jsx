import { useState, useEffect } from 'react';
import { getRooms, createRoom, updateRoom, deleteRoom, getCampuses, getBuildings } from '../../api/roomApi';
import { useAuth } from '../../context/AuthContext';
import PermissionGate from '../../components/PermissionGate/PermissionGate';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Alert/Alert';
import SimpleTable from '../../components/Tables/SimpleTable';
import AdvancedSearch from '../../components/AdvancedSearch/AdvancedSearch';
import './AdminRooms.css';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    campus: 'all',
    type: 'all',
    status: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    campus_id: '',
    building_id: '',
    room_number: '',
    room_name: '',
    building: '',
    floor: '1',
    room_type: 'classroom',
    capacity: '',
    current_occupancy: 0,
    status: 'available',
    scheduled_classes: [],
    schedule_start: '',
    schedule_end: '',
    class_subject: '',
    instructor: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomsData, campusesData] = await Promise.all([
        getRooms(),
        getCampuses()
      ]);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
      setCampuses(Array.isArray(campusesData) ? campusesData : []);
    } catch (error) {
      console.error('Error loading rooms:', error);
      showAlert('Failed to load rooms data', 'error');
      setRooms([]);
      setCampuses([]);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleOpenModal = async (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        campus_id: room.campus_uid || '',
        building_id: room.building_uid || '',
        room_number: room.roomNumber || '',
        room_name: room.name || '',
        building: room.buildingName || '',
        floor: room.floor || '1',
        room_type: room.type || 'classroom',
        capacity: room.capacity || '',
        current_occupancy: room.currentOccupancy || 0,
        status: room.status || 'available',
        scheduled_classes: room.scheduled_classes || [],
        schedule_start: '',
        schedule_end: '',
        class_subject: '',
        instructor: ''
      });
      // Load buildings for the selected campus
      if (room.campus_uid) {
        try {
          const buildingsData = await getBuildings(room.campus_uid);
          setBuildings(buildingsData);
        } catch (error) {
          console.error('Error loading buildings:', error);
          setBuildings([]);
        }
      }
    } else {
      setEditingRoom(null);
      setFormData({
        campus_id: '',
        building_id: '',
        room_number: '',
        room_name: '',
        building: '',
        floor: '1',
        room_type: 'classroom',
        capacity: '',
        current_occupancy: 0,
        status: 'available',
        scheduled_classes: [],
        schedule_start: '',
        schedule_end: '',
        class_subject: '',
        instructor: ''
      });
      setBuildings([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoom(null);
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    
    // Load buildings when campus is selected
    if (name === 'campus_id' && value) {
      console.log('Campus selected:', value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        building_id: '' // Reset building when campus changes
      }));
      try {
        console.log('Fetching buildings for campus:', value);
        const buildingsData = await getBuildings(value);
        console.log('Buildings fetched:', buildingsData);
        setBuildings(buildingsData);
      } catch (error) {
        console.error('Error loading buildings:', error);
        setBuildings([]);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddSchedule = () => {
    if (!formData.schedule_start || !formData.schedule_end || !formData.class_subject) {
      showAlert('Please fill in all schedule fields', 'error');
      return;
    }

    const newSchedule = {
      start_time: formData.schedule_start,
      end_time: formData.schedule_end,
      subject: formData.class_subject,
      instructor: formData.instructor || 'TBA'
    };

    setFormData(prev => ({
      ...prev,
      scheduled_classes: [...prev.scheduled_classes, newSchedule],
      schedule_start: '',
      schedule_end: '',
      class_subject: '',
      instructor: ''
    }));
  };

  const handleRemoveSchedule = (index) => {
    setFormData(prev => ({
      ...prev,
      scheduled_classes: prev.scheduled_classes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.campus_id || !formData.building_id || !formData.room_number || !formData.room_name) {
      showAlert('Please fill in all required fields (Campus, Building, Room Number, Room Name)', 'error');
      return;
    }

    try {
      const submitData = { ...formData };
      delete submitData.schedule_start;
      delete submitData.schedule_end;
      delete submitData.class_subject;
      delete submitData.instructor;

      if (editingRoom) {
        await updateRoom(editingRoom.uid, submitData);
        showAlert('Room updated successfully', 'success');
      } else {
        await createRoom(submitData);
        showAlert('Room created successfully', 'success');
      }
      handleCloseModal();
      loadData();
    } catch (error) {
      showAlert('Failed to save room', 'error');
    }
  };

  const handleDelete = async (roomId, roomName) => {
    if (window.confirm(`Are you sure you want to delete "${roomName}"?`)) {
      try {
        await deleteRoom(roomId);
        showAlert('Room deleted successfully', 'success');
        loadData();
      } catch (error) {
        showAlert('Failed to delete room', 'error');
      }
    }
  };

  const filteredRooms = rooms.filter(room => {
    // Campus filter
    if (filters.campus !== 'all' && room.campus_uid && room.campus_uid !== filters.campus) return false;
    
    // Room type filter
    if (filters.type !== 'all' && room.type !== filters.type) return false;
    
    // Status filter
    if (filters.status !== 'all' && room.status !== filters.status) return false;
    
    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        room.roomNumber?.toLowerCase().includes(term) ||
        room.name?.toLowerCase().includes(term) ||
        room.buildingName?.toLowerCase().includes(term) ||
        room.campusName?.toLowerCase().includes(term) ||
        room.type?.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const handleSearch = (term, activeFilters) => {
    setSearchTerm(term);
    setFilters(prev => ({
      ...prev,
      ...activeFilters
    }));
  };

  const tableColumns = [
    { 
      key: 'roomNumber', 
      label: 'ROOM #',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'name', 
      label: 'NAME',
      render: (value) => value || 'N/A'
    },
    { 
      key: 'buildingName', 
      label: 'BUILDING',
      render: (value, row) => `${value} (${row.buildingCode || ''})`
    },
    { 
      key: 'campusName', 
      label: 'CAMPUS'
    },
    { 
      key: 'type', 
      label: 'TYPE',
      render: (value) => (
        <span className={`table-badge type-${value}`}>
          {value ? value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ') : 'N/A'}
        </span>
      )
    },
    { 
      key: 'floor', 
      label: 'FLOOR'
    },
    { 
      key: 'capacity', 
      label: 'CAPACITY',
      render: (value) => value ? value.toLocaleString() : 'N/A'
    },
    { 
      key: 'currentOccupancy', 
      label: 'OCCUPANCY',
      render: (value, row) => {
        const occupancy = parseInt(value) || 0;
        const capacity = parseInt(row.capacity) || 0;
        const rate = parseInt(row.occupancyRate) || 0;
        const barWidth = Math.min(Math.max(rate, 0), 100);
        
        return (
          <div className="utilization-cell">
            <span>{occupancy}/{capacity} ({rate}%)</span>
            <div className="progress-bar">
              <div 
                className={`progress-fill progress-${row.status}`}
                style={{ width: `${barWidth}%` }}
              ></div>
            </div>
          </div>
        );
      }
    },
    { 
      key: 'status', 
      label: 'STATUS',
      render: (value) => (
        <span className={`table-badge status-${value}`}>
          {value?.toUpperCase()}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (_, row) => (
        <div className="table-actions">
          <button className="btn-icon btn-edit" onClick={() => handleOpenModal(row)} title="Edit">
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn-icon btn-delete" onClick={() => handleDelete(row.uid, row.name)} title="Delete">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const stats = {
    total: filteredRooms.length,
    available: filteredRooms.filter(r => r.status === 'available').length,
    occupied: filteredRooms.filter(r => r.status === 'occupied').length,
    totalCapacity: filteredRooms.reduce((sum, r) => sum + (parseInt(r.capacity) || 0), 0)
  };

  if (loading) {
    return (
      <div className="admin-rooms-page">
        <div className="loading-state">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="admin-rooms-page">
      {alert && <Alert message={alert.message} type={alert.type} />}
      
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Room Management</h1>
          <p className="page-subtitle">Manage rooms, capacity, scheduling, and space utilization</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <i className="fas fa-plus"></i>
          Add Room
        </button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <i className="fas fa-door-open"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Rooms</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.available}</span>
            <span className="stat-label">Available</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.occupied}</span>
            <span className="stat-label">Occupied</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
            <i className="fas fa-chair"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalCapacity.toLocaleString()}</span>
            <span className="stat-label">Total Capacity</span>
          </div>
        </div>
      </div>

      <AdvancedSearch
        onSearch={handleSearch}
        placeholder="Search rooms by number, name, building, campus..."
        filters={[
          {
            key: 'type',
            label: 'Room Type',
            options: [
              { value: 'all', label: 'All Types' },
              { value: 'classroom', label: 'Classroom' },
              { value: 'lab', label: 'Laboratory' },
              { value: 'lecture-hall', label: 'Lecture Hall' },
              { value: 'auditorium', label: 'Auditorium' },
              { value: 'office', label: 'Office' },
              { value: 'library', label: 'Library' },
              { value: 'other', label: 'Other' }
            ]
          },
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'available', label: 'Available' },
              { value: 'occupied', label: 'Occupied' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'reserved', label: 'Reserved' }
            ]
          }
        ]}
      />

      <div className="table-container">
        <SimpleTable 
          columns={tableColumns}
          data={filteredRooms}
        />
      </div>

      <Modal isOpen={showModal} onClose={handleCloseModal} title={editingRoom ? 'Edit Room' : 'Add New Room'}>
        <form onSubmit={handleSubmit} className="room-form">
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
                <option key={campus.uid || campus.campus_id || campus.id} value={campus.uid || campus.campus_id || campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="building_id">Building *</label>
            <select
              id="building_id"
              name="building_id"
              value={formData.building_id}
              onChange={handleInputChange}
              required
              disabled={!formData.campus_id}
            >
              <option value="">Select Building</option>
              {buildings.map(building => (
                <option key={building.uid || building.building_id || building.id} value={building.uid || building.building_id || building.id}>
                  {building.name || building.building_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="room_number">Room Number *</label>
              <input
                type="text"
                id="room_number"
                name="room_number"
                value={formData.room_number}
                onChange={handleInputChange}
                placeholder="e.g., A-301"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="room_name">Room Name *</label>
              <input
                type="text"
                id="room_name"
                name="room_name"
                value={formData.room_name}
                onChange={handleInputChange}
                placeholder="e.g., Computer Lab 1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="floor">Floor</label>
              <input
                type="number"
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                placeholder="1"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="room_type">Room Type</label>
              <select
                id="room_type"
                name="room_type"
                value={formData.room_type}
                onChange={handleInputChange}
              >
                <option value="classroom">Classroom</option>
                <option value="lab">Lab</option>
                <option value="lecture-hall">Lecture Hall</option>
                <option value="auditorium">Auditorium</option>
                <option value="library">Library</option>
                <option value="office">Office</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="capacity">Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="50"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="current_occupancy">Current Occupancy</label>
              <input
                type="number"
                id="current_occupancy"
                name="current_occupancy"
                value={formData.current_occupancy}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
              />
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
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
          </div>

          <div className="schedule-section">
            <h3 className="section-title">Class Schedule</h3>
            
            <div className="schedule-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="schedule_start">Start Time</label>
                  <input
                    type="time"
                    id="schedule_start"
                    name="schedule_start"
                    value={formData.schedule_start}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="schedule_end">End Time</label>
                  <input
                    type="time"
                    id="schedule_end"
                    name="schedule_end"
                    value={formData.schedule_end}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="class_subject">Subject</label>
                  <input
                    type="text"
                    id="class_subject"
                    name="class_subject"
                    value={formData.class_subject}
                    onChange={handleInputChange}
                    placeholder="e.g., Data Structures"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="instructor">Instructor</label>
                  <input
                    type="text"
                    id="instructor"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    placeholder="e.g., Dr. Smith"
                  />
                </div>
              </div>

              <button type="button" className="btn-add-schedule" onClick={handleAddSchedule}>
                <i className="fas fa-plus"></i>
                Add to Schedule
              </button>
            </div>

            {formData.scheduled_classes.length > 0 && (
              <div className="schedule-list">
                <h4 className="list-title">Scheduled Classes ({formData.scheduled_classes.length})</h4>
                {formData.scheduled_classes.map((schedule, index) => (
                  <div key={index} className="schedule-item">
                    <div className="schedule-info">
                      <span className="schedule-time">
                        <i className="fas fa-clock"></i>
                        {schedule.start_time} - {schedule.end_time}
                      </span>
                      <span className="schedule-subject">{schedule.subject}</span>
                      <span className="schedule-instructor">
                        <i className="fas fa-user"></i>
                        {schedule.instructor}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      className="btn-remove" 
                      onClick={() => handleRemoveSchedule(index)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingRoom ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminRooms;
