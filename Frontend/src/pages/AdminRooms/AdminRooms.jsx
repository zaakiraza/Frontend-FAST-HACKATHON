import { useState, useEffect } from 'react';
import { getRooms, createRoom, updateRoom, deleteRoom, getCampuses } from '../../api/roomApi';
import Modal from '../../components/Modal/Modal';
import Alert from '../../components/Alert/Alert';
import SimpleTable from '../../components/Tables/SimpleTable';
import './AdminRooms.css';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [alert, setAlert] = useState(null);
  const [filters, setFilters] = useState({
    campus: 'all',
    type: 'all',
    status: 'all'
  });
  const [formData, setFormData] = useState({
    campus_id: '',
    room_number: '',
    room_name: '',
    building: '',
    floor: '',
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
      setRooms(roomsData);
      setCampuses(campusesData);
    } catch (error) {
      showAlert('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'info') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        campus_id: room.campus_id,
        room_number: room.room_number,
        room_name: room.room_name,
        building: room.building,
        floor: room.floor,
        room_type: room.room_type,
        capacity: room.capacity,
        current_occupancy: room.current_occupancy,
        status: room.status,
        scheduled_classes: room.scheduled_classes || [],
        schedule_start: '',
        schedule_end: '',
        class_subject: '',
        instructor: ''
      });
    } else {
      setEditingRoom(null);
      setFormData({
        campus_id: '',
        room_number: '',
        room_name: '',
        building: '',
        floor: '',
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
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoom(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    
    if (!formData.campus_id || !formData.room_number || !formData.room_name) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    try {
      const submitData = { ...formData };
      delete submitData.schedule_start;
      delete submitData.schedule_end;
      delete submitData.class_subject;
      delete submitData.instructor;

      if (editingRoom) {
        await updateRoom(editingRoom.room_id, submitData);
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
    if (filters.campus !== 'all' && room.campus_id !== parseInt(filters.campus)) return false;
    if (filters.type !== 'all' && room.room_type !== filters.type) return false;
    if (filters.status !== 'all' && room.status !== filters.status) return false;
    return true;
  });

  const tableColumns = [
    { key: 'room_number', label: 'Room #' },
    { key: 'room_name', label: 'Name' },
    { key: 'building', label: 'Building' },
    { key: 'floor', label: 'Floor' },
    { key: 'room_type', label: 'Type' },
    { 
      key: 'capacity', 
      label: 'Capacity',
      render: (value) => value.toLocaleString()
    },
    { 
      key: 'current_occupancy', 
      label: 'Occupancy',
      render: (value, row) => `${value}/${row.capacity} (${Math.round((value/row.capacity)*100)}%)`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`table-badge status-${value}`}>{value}</span>
      )
    },
    { 
      key: 'scheduled_classes', 
      label: 'Scheduled',
      render: (value) => value?.length || 0
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="table-actions">
          <button className="btn-icon btn-edit" onClick={() => handleOpenModal(row)} title="Edit">
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn-icon btn-delete" onClick={() => handleDelete(row.room_id, row.room_name)} title="Delete">
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

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

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="campus-filter">Campus</label>
          <select 
            id="campus-filter"
            value={filters.campus}
            onChange={(e) => setFilters(prev => ({ ...prev, campus: e.target.value }))}
          >
            <option value="all">All Campuses</option>
            {campuses.map(campus => (
              <option key={campus.campus_id} value={campus.campus_id}>
                {campus.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="type-filter">Room Type</label>
          <select 
            id="type-filter"
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="all">All Types</option>
            <option value="classroom">Classroom</option>
            <option value="lab">Lab</option>
            <option value="lecture-hall">Lecture Hall</option>
            <option value="auditorium">Auditorium</option>
            <option value="library">Library</option>
            <option value="office">Office</option>
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
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>

        <div className="filter-stats">
          <span className="stat-badge">
            <i className="fas fa-door-open"></i>
            {filteredRooms.length} Rooms
          </span>
          <span className="stat-badge">
            <i className="fas fa-users"></i>
            {filteredRooms.reduce((sum, r) => sum + r.capacity, 0).toLocaleString()} Total Capacity
          </span>
        </div>
      </div>

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
                <option key={campus.campus_id} value={campus.campus_id}>
                  {campus.name}
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
              <label htmlFor="floor">Floor</label>
              <input
                type="number"
                id="floor"
                name="floor"
                value={formData.floor}
                onChange={handleInputChange}
                placeholder="3"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
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
              />
            </div>
          </div>

          <div className="form-row">
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
