import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>Restaurant</h2>
          <span className="subtitle">Management System</span>
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              <span className="nav-icon">&#9632;</span>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/reservations">
              <span className="nav-icon">&#9632;</span>
              Reservations
            </NavLink>
          </li>
          <li>
            <NavLink to="/events">
              <span className="nav-icon">&#9632;</span>
              Events
            </NavLink>
          </li>
          <li>
            <NavLink to="/menu">
              <span className="nav-icon">&#9632;</span>
              Menu Items
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
