import { useState, useEffect } from 'react';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';
import Modal from '../components/Modal';

const categories = [
  { value: 'appetizer', label: 'Appetizer' },
  { value: 'main_course', label: 'Main Course' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'beverage', label: 'Beverage' },
  { value: 'side', label: 'Side' },
];

const emptyForm = {
  name: '', description: '', price: '', category: 'appetizer', is_available: true,
};

export default function MenuItems() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, [filter]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter) params.category = filter;
      const res = await getMenuItems(params);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load menu items:', err);
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

  const openEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      is_available: item.is_available,
    });
    setEditing(item.id);
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (editing) {
        await updateMenuItem(editing, form);
      } else {
        await createMenuItem(form);
      }
      setShowModal(false);
      loadItems();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await deleteMenuItem(id);
      loadItems();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await updateMenuItem(item.id, { is_available: !item.is_available });
      loadItems();
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const getCategoryLabel = (cat) => categories.find(c => c.value === cat)?.label || cat;

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="page-header">
        <h1>Menu Items</h1>
        <div className="page-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={openCreate}>+ New Item</button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p>No menu items found</p>
          <button className="btn btn-primary" onClick={openCreate}>Add First Menu Item</button>
        </div>
      ) : (
        <div className="menu-grid">
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div key={category} className="menu-section">
              <h2 className="menu-section-title">{getCategoryLabel(category)}</h2>
              <div className="menu-cards">
                {categoryItems.map((item) => (
                  <div key={item.id} className={`menu-card ${!item.is_available ? 'unavailable' : ''}`}>
                    <div className="menu-card-header">
                      <h3>{item.name}</h3>
                      <span className="menu-card-price">${Number(item.price).toFixed(2)}</span>
                    </div>
                    {item.description && <p className="menu-card-desc">{item.description}</p>}
                    <div className="menu-card-footer">
                      <button
                        className={`btn btn-xs ${item.is_available ? 'btn-success' : 'btn-danger'}`}
                        onClick={() => toggleAvailability(item)}
                      >
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </button>
                      <div>
                        <button className="btn btn-xs" onClick={() => openEdit(item)}>Edit</button>
                        <button className="btn btn-xs btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Menu Item' : 'New Menu Item'}>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
            {errors.name && <span className="error">{errors.name[0]}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} required>
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Price *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
              {errors.price && <span className="error">{errors.price[0]}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows="3" placeholder="Brief description of the dish..." />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={form.is_available} onChange={(e) => setForm({...form, is_available: e.target.checked})} />
              Available for ordering
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Menu Item</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
