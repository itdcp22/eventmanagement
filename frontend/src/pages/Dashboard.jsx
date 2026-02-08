import { useState, useEffect } from 'react';
import { getDashboardSummary, getUpcoming, getCalendarData } from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [upcoming, setUpcoming] = useState({ reservations: [], events: [] });
  const [calendar, setCalendar] = useState({ reservations: {}, events: {} });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadCalendar();
  }, [currentDate]);

  const loadData = async () => {
    try {
      const [summaryRes, upcomingRes] = await Promise.all([
        getDashboardSummary(),
        getUpcoming(),
      ]);
      setSummary(summaryRes.data);
      setUpcoming(upcomingRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCalendar = async () => {
    try {
      const res = await getCalendarData({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      });
      setCalendar(res.data);
    } catch (err) {
      console.error('Failed to load calendar:', err);
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayReservations = calendar.reservations[dateStr] || [];
      const dayEvents = calendar.events[dateStr] || [];
      const hasItems = dayReservations.length > 0 || dayEvents.length > 0;
      const isToday = new Date().toISOString().split('T')[0] === dateStr;
      const isSelected = selectedDay === dateStr;

      days.push(
        <div
          key={day}
          className={`calendar-day ${hasItems ? 'has-items' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => hasItems && setSelectedDay(isSelected ? null : dateStr)}
        >
          <span className="day-number">{day}</span>
          {dayReservations.length > 0 && (
            <span className="day-indicator reservation-indicator">{dayReservations.length}R</span>
          )}
          {dayEvents.length > 0 && (
            <span className="day-indicator event-indicator">{dayEvents.length}E</span>
          )}
        </div>
      );
    }

    return days;
  };

  const getSelectedDayDetails = () => {
    if (!selectedDay) return null;
    const reservations = calendar.reservations[selectedDay] || [];
    const events = calendar.events[selectedDay] || [];
    return { reservations, events };
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const selectedDetails = getSelectedDayDetails();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{summary.today_reservations}</div>
            <div className="stat-label">Today's Reservations</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.today_events}</div>
            <div className="stat-label">Today's Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.total_guests_today}</div>
            <div className="stat-label">Expected Guests Today</div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-value">${Number(summary.estimated_revenue || 0).toLocaleString()}</div>
            <div className="stat-label">Monthly Event Revenue</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.pending_reservations}</div>
            <div className="stat-label">Pending Reservations</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.confirmed_reservations}</div>
            <div className="stat-label">Confirmed Reservations</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.pending_events}</div>
            <div className="stat-label">Pending Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{summary.confirmed_events}</div>
            <div className="stat-label">Confirmed Events</div>
          </div>
        </div>
      )}

      <div className="dashboard-sections">
        <div className="calendar-section">
          <div className="calendar-header">
            <button className="btn btn-sm" onClick={prevMonth}>&lt; Prev</button>
            <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <button className="btn btn-sm" onClick={nextMonth}>Next &gt;</button>
          </div>
          <div className="calendar-grid">
            <div className="calendar-weekday">Sun</div>
            <div className="calendar-weekday">Mon</div>
            <div className="calendar-weekday">Tue</div>
            <div className="calendar-weekday">Wed</div>
            <div className="calendar-weekday">Thu</div>
            <div className="calendar-weekday">Fri</div>
            <div className="calendar-weekday">Sat</div>
            {renderCalendar()}
          </div>

          {selectedDetails && (
            <div className="day-details">
              <h3>Details for {selectedDay}</h3>
              {selectedDetails.reservations.length > 0 && (
                <div>
                  <h4>Reservations ({selectedDetails.reservations.length})</h4>
                  {selectedDetails.reservations.map((r) => (
                    <div key={r.id} className="detail-item">
                      <span>{r.name}</span>
                      <span>{new Date(r.visit_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{r.number_of_guests} guests</span>
                      <StatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              )}
              {selectedDetails.events.length > 0 && (
                <div>
                  <h4>Events ({selectedDetails.events.length})</h4>
                  {selectedDetails.events.map((e) => (
                    <div key={e.id} className="detail-item">
                      <span>{e.name}</span>
                      <span>{e.event_type}</span>
                      <span>{e.number_of_attendees} attendees</span>
                      <StatusBadge status={e.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="upcoming-section">
          <h2>Upcoming Reservations</h2>
          {upcoming.reservations.length === 0 ? (
            <p className="empty-text">No upcoming reservations</p>
          ) : (
            <div className="upcoming-list">
              {upcoming.reservations.map((r) => (
                <div key={r.id} className="upcoming-item">
                  <div className="upcoming-info">
                    <strong>{r.name}</strong>
                    <span>{new Date(r.visit_datetime).toLocaleDateString()} at {new Date(r.visit_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="upcoming-meta">
                    <span>{r.number_of_guests} guests</span>
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2>Upcoming Events</h2>
          {upcoming.events.length === 0 ? (
            <p className="empty-text">No upcoming events</p>
          ) : (
            <div className="upcoming-list">
              {upcoming.events.map((e) => (
                <div key={e.id} className="upcoming-item">
                  <div className="upcoming-info">
                    <strong>{e.name}</strong>
                    <span>{new Date(e.event_datetime).toLocaleDateString()} - {e.event_type.replace('_', ' ')}</span>
                  </div>
                  <div className="upcoming-meta">
                    <span>{e.number_of_attendees} attendees</span>
                    <StatusBadge status={e.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
