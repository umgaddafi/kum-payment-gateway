import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="site-shell">
      <header className="topbar">
        <div className="brand-block">
          <p className="brand-kicker">Demo Full-Stack App</p>
          <NavLink className="brand-name" to="/">
            KUM Payment Gateway
          </NavLink>
        </div>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <button className="ghost-button" onClick={logout} type="button">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>
      </header>

      <main className="page-content">{children}</main>
    </div>
  );
}
