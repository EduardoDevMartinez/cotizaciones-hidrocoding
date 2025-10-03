import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCotizaciones } from '../context/CotizacionesContext';
import { useAuth } from '../context/AuthContext';
import '../styles/MainLayout.css';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { estadisticas } = useCotizaciones();
  const { user, signOut } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="main-layout">
      <aside className={`sidebar ${menuAbierto ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-bracket">{'<'}</span>
            Hidro_coding
            <span className="logo-bracket">{'/>'}</span>
          </div>
          <button className="menu-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
            {menuAbierto ? '✕' : '☰'}
          </button>
        </div>
        <div className="sidebar-version">
          <span>v2.0.0</span>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/"
            className={`nav-item ${isActive('/') && !isActive('/cotizaciones') && !isActive('/nueva-cotizacion') ? 'active' : ''}`}
            onClick={() => setMenuAbierto(false)}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </Link>

          <Link
            to="/cotizaciones"
            className={`nav-item ${isActive('/cotizaciones') || isActive('/cotizacion') || isActive('/editar') ? 'active' : ''}`}
            onClick={() => setMenuAbierto(false)}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Cotizaciones</span>
            {estadisticas.total > 0 && (
              <span className="nav-badge">{estadisticas.total}</span>
            )}
          </Link>

          <Link
            to="/nueva-cotizacion"
            className={`nav-item ${isActive('/nueva-cotizacion') ? 'active' : ''}`}
            onClick={() => setMenuAbierto(false)}
          >
            <span className="nav-icon">➕</span>
            <span className="nav-text">Nueva Cotización</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="stats-mini">
            <div className="stat-mini">
              <span className="stat-mini-icon">✅</span>
              <div>
                <div className="stat-mini-value">{estadisticas.aprobadas}</div>
                <div className="stat-mini-label">Aprobadas</div>
              </div>
            </div>
            <div className="stat-mini">
              <span className="stat-mini-icon">💰</span>
              <div>
                <div className="stat-mini-value">
                  {new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(estadisticas.montoAprobado)}
                </div>
                <div className="stat-mini-label">Monto</div>
              </div>
            </div>
          </div>

          <div className="user-info">
            <div className="user-avatar">{user?.email?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="user-email">{user?.email}</div>
              <button onClick={handleSignOut} className="btn-logout">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <button className="mobile-menu-btn" onClick={() => setMenuAbierto(!menuAbierto)}>
          ☰
        </button>
        <Outlet />
      </main>

      {menuAbierto && (
        <div className="overlay" onClick={() => setMenuAbierto(false)} />
      )}
    </div>
  );
};

export default MainLayout;
