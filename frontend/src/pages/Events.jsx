import { useState, useEffect } from 'react';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const eventTypes = [
  { value: 'birthday', label: 'Birthday Party' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'team_building', label: 'Team Building' },
  { value: 'company', label: 'Company Event' },
  { value: 'family', label: 'Family Event' },
];

const emptyForm = {
  name: '', email: '', mobile: '', event_type: 'birthday',
  location: 'indoor', event_datetime: '', event_end_datetime: '',
  number_of_attendees: 10, special_requests: '', estimated_budget: '',
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [filterStatus, filterType]);

  const loadEvents = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page };
      if (filterStatus) params.status = filterStatus;
      if (filterType) params.event_type = filterType;
      const res = await getEvents(params);
      setEvents(res.data.data);
      setPagination({ current: res.data.current_page, last: res.data.last_page });
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (event) => {
    setForm({
      name: event.name,
      email: event.email,
      mobile: event.mobile,
      event_type: event.event_type,
      location: event.location,
      event_datetime: event.event_datetime.slice(0, 16),
      event_end_datetime: event.event_end_datetime ? event.event_end_datetime.slice(0, 16) : '',
      number_of_attendees: event.number_of_attendees,
      special_requests: event.special_requests || '',
      estimated_budget: event.estimated_budget || '',
      status: event.status,
    });
    setEditing(event.id);
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const data = { ...form };
      if (!data.event_end_datetime) delete data.event_end_datetime;
      if (!data.estimated_budget) delete data.estimated_budget;
      if (editing) {
        await updateEvent(editing, data);
      } else {
        await createEvent(data);
      }
      setShowModal(false);
      loadEvents();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(id);
      loadEvents();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateEvent(id, { status });
      loadEvents();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getEventTypeLabel = (type) => {
    return eventTypes.find(t => t.value === type)?.label || type;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Event Bookings</h1>
        <div className="page-actions">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
            <option value="">All Types</option>
            {eventTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <button className="btn btn-primary" onClick={openCreate}>+ New Event</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <p>No events found</p>
          <button className="btn btn-primary" onClick={openCreate}>Create First Event</button>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Date & Time</th>
                  <th>Attendees</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <strong>{e.name}</strong>
                      <div className="text-muted">{e.email}</div>
                    </td>
                    <td><span className="type-badge">{getEventTypeLabel(e.event_type)}</span></td>
                    <td className="capitalize">{e.location}</td>
                    <td>{new Date(e.event_datetime).toLocaleDateString()} {new Date(e.event_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{e.number_of_attendees}</td>
                    <td>{e.estimated_budget ? `$${Number(e.estimated_budget).toLocaleString()}` : '-'}</td>
                    <td><StatusBadge status={e.status} /></td>
                    <td>
                      <div className="action-buttons">
                        {e.status === 'pending' && (
                          <button className="btn btn-xs btn-success" onClick={() => handleStatusChange(e.id, 'confirmed')}>Confirm</button>
                        )}
                        {e.status === 'confirmed' && (
                          <button className="btn btn-xs btn-info" onClick={() => handleStatusChange(e.id, 'completed')}>Complete</button>
                        )}
                        <button className="btn btn-xs" onClick={() => openEdit(e)}>Edit</button>
                        <button className="btn btn-xs btn-danger" onClick={() => handleDelete(e.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.last > 1 && (
            <div className="pagination">
              {Array.from({ length: pagination.last }, (_, i) => (
                <button
                  key={i + 1}
                  className={`btn btn-sm ${pagination.current === i + 1 ? 'btn-primary' : ''}`}
                  onClick={() => loadEvents(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Event' : 'New Event Booking'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Contact Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
              {errors.name && <span className="error">{errors.name[0]}</span>}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
              {errors.email && <span className="error">{errors.email[0]}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Mobile *</label>
              <input type="tel" value={form.mobile} onChange={(e) => setForm({...form, mobile: e.target.value})} required />
              {errors.mobile && <span className="error">{errors.mobile[0]}</span>}
            </div>
            <div className="form-group">
              <label>Event Type *</label>
              <select value={form.event_type} onChange={(e) => setForm({...form, event_type: e.target.value})} required>
                {eventTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {errors.event_type && <span className="error">{errors.event_type[0]}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <select value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} required>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Number of Attendees *</label>
              <input type="number" min="1" max="500" value={form.number_of_attendees} onChange={(e) => setForm({...form, number_of_attendees: parseInt(e.target.value)})} required />
              {errors.number_of_attendees && <span className="error">{errors.number_of_attendees[0]}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Event Start *</label>
              <input type="datetime-local" value={form.event_datetime} onChange={(e) => setForm({...form, event_datetime: e.target.value})} required />
              {errors.event_datetime && <span className="error">{errors.event_datetime[0]}</span>}
            </div>
            <div className="form-group">
              <label>Event End</label>
              <input type="datetime-local" value={form.event_end_datetime} onChange={(e) => setForm({...form, event_end_datetime: e.target.value})} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Estimated Budget ($)</label>
              <input type="number" min="0" step="0.01" value={form.estimated_budget} onChange={(e) => setForm({...form, estimated_budget: e.target.value})} placeholder="Optional" />
            </div>
            {editing && (
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Special Requests</label>
            <textarea value={form.special_requests} onChange={(e) => setForm({...form, special_requests: e.target.value})} rows="3" placeholder="Decorations, AV equipment, dietary requirements, themes..." />
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Event</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
