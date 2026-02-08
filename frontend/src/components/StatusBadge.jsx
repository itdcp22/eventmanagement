const statusColors = {
  pending: '#f59e0b',
  confirmed: '#10b981',
  cancelled: '#ef4444',
  completed: '#6366f1',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className="status-badge"
      style={{ backgroundColor: statusColors[status] || '#6b7280' }}
    >
      {status}
    </span>
  );
}
