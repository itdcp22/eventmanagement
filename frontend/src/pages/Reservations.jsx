import { useState, useEffect } from 'react';
import { getReservations, createReservation, updateReservation, deleteReservation, getMenuItems } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';

const emptyForm = {
  name: '', email: '', mobile: '', visit_datetime: '',
  number_of_guests: 1, menu_selections: [], special_requests: '',
};

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
    loadMenuItems();
  }, [filter]);

  const loadReservations = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page };
      if (filter) params.status = filter;
      const res = await getReservations(params);
      setReservations(res.data.data);
      setPagination({ current: res.data.current_page, last: res.data.last_page });
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMenuItems = async () => {
    try {
      const res = await getMenuItems({ available_only: true });
      setMenuItems(res.data);
    } catch (err) {
      console.error('Failed to load menu items:', err);
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (reservation) => {
    setForm({
      name: reservation.name,
      email: reservation.email,
      mobile: reservation.mobile,
      visit_datetime: reservation.visit_datetime.slice(0, 16),
      number_of_guests: reservation.number_of_guests,
      menu_selections: reservation.menu_selections || [],
      special_requests: reservation.special_requests || '',
      status: reservation.status,
    });
    setEditing(reservation.id);
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (editing) {
        await updateReservation(editing, form);
      } else {
        await createReservation(form);
      }
      setShowModal(false);
      loadReservations();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;
    try {
      await deleteReservation(id);
      loadReservations();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateReservation(id, { status });
      loadReservations();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const toggleMenuSelection = (id) => {
    setForm(prev => ({
      ...prev,
      menu_selections: prev.menu_selections.includes(id)
        ? prev.menu_selections.filter(i => i !== id)
        : [...prev.menu_selections, id]
    }));
  };

  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryLabels = {
    appetizer: 'Appetizers', main_course: 'Main Course',
    dessert: 'Desserts', beverage: 'Beverages', side: 'Sides',
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Reservations</h1>
        <div className="page-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <button className="btn btn-primary" onClick={openCreate}>+ New Reservation</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <p>No reservations found</p>
          <button className="btn btn-primary" onClick={openCreate}>Create First Reservation</button>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Date & Time</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.name}</strong></td>
                    <td>
                      <div>{r.email}</div>
                      <div className="text-muted">{r.mobile}</div>
                    </td>
                    <td>{new Date(r.visit_datetime).toLocaleDateString()} {new Date(r.visit_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{r.number_of_guests}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      <div className="action-buttons">
                        {r.status === 'pending' && (
                          <button className="btn btn-xs btn-success" onClick={() => handleStatusChange(r.id, 'confirmed')}>Confirm</button>
                        )}
                        {r.status === 'confirmed' && (
                          <button className="btn btn-xs btn-info" onClick={() => handleStatusChange(r.id, 'completed')}>Complete</button>
                        )}
                        <button className="btn btn-xs" onClick={() => openEdit(r)}>Edit</button>
                        <button className="btn btn-xs btn-danger" onClick={() => handleDelete(r.id)}>Delete</button>
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
                  onClick={() => loadReservations(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Reservation' : 'New Reservation'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
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
              <label>Date & Time *</label>
              <input type="datetime-local" value={form.visit_datetime} onChange={(e) => setForm({...form, visit_datetime: e.target.value})} required />
              {errors.visit_datetime && <span className="error">{errors.visit_datetime[0]}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Number of Guests *</label>
              <input type="number" min="1" max="50" value={form.number_of_guests} onChange={(e) => setForm({...form, number_of_guests: parseInt(e.target.value)})} required />
              {errors.number_of_guests && <span className="error">{errors.number_of_guests[0]}</span>}
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

          {Object.keys(groupedMenu).length > 0 && (
            <div className="form-group">
              <label>Menu Pre-Selection</label>
              <div className="menu-selection">
                {Object.entries(groupedMenu).map(([category, items]) => (
                  <div key={category} className="menu-category">
                    <strong>{categoryLabels[category] || category}</strong>
                    <div className="menu-items-grid">
                      {items.map((item) => (
                        <label key={item.id} className={`menu-item-option ${form.menu_selections.includes(item.id) ? 'selected' : ''}`}>
                          <input
                            type="checkbox"
                            checked={form.menu_selections.includes(item.id)}
                            onChange={() => toggleMenuSelection(item.id)}
                          />
                          <span>{item.name}</span>
                          <span className="menu-price">${Number(item.price).toFixed(2)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Special Requests</label>
            <textarea value={form.special_requests} onChange={(e) => setForm({...form, special_requests: e.target.value})} rows="3" placeholder="Any dietary requirements, celebrations, seating preferences..." />
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Reservation</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
