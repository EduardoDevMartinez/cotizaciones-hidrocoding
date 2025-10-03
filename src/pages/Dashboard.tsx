import React from 'react';
import { Link } from 'react-router-dom';
import { useCotizaciones } from '../context/CotizacionesContext';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { estadisticas, cotizaciones } = useCotizaciones();

  const cotizacionesRecientes = [...cotizaciones]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const getEstadoBadgeClass = (estado: string) => {
    const classes: Record<string, string> = {
      'borrador': 'badge-borrador',
      'enviada': 'badge-enviada',
      'aprobada': 'badge-aprobada',
      'rechazada': 'badge-rechazada',
      'vencida': 'badge-vencida'
    };
    return classes[estado] || '';
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      'borrador': 'Borrador',
      'enviada': 'Enviada',
      'aprobada': 'Aprobada',
      'rechazada': 'Rechazada',
      'vencida': 'Vencida'
    };
    return labels[estado] || estado;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/nueva-cotizacion" className="btn btn-primary">
          <span className="icon">+</span>
          Nueva Cotización
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">📊</div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.total}</div>
            <div className="stat-label">Total Cotizaciones</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon borrador">📝</div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.borradores}</div>
            <div className="stat-label">Borradores</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon enviada">📤</div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.enviadas}</div>
            <div className="stat-label">Enviadas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon aprobada">✅</div>
          <div className="stat-content">
            <div className="stat-value">{estadisticas.aprobadas}</div>
            <div className="stat-label">Aprobadas</div>
          </div>
        </div>

        <div className="stat-card monto">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(estadisticas.montoTotal)}</div>
            <div className="stat-label">Monto Total</div>
          </div>
        </div>

        <div className="stat-card monto-aprobado">
          <div className="stat-icon">💵</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(estadisticas.montoAprobado)}</div>
            <div className="stat-label">Monto Aprobado</div>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2>Cotizaciones Recientes</h2>
          <Link to="/cotizaciones" className="link-view-all">Ver todas →</Link>
        </div>

        {cotizacionesRecientes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No hay cotizaciones</h3>
            <p>Comienza creando tu primera cotización</p>
            <Link to="/nueva-cotizacion" className="btn btn-primary">
              Crear Cotización
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cotizacionesRecientes.map((cotizacion) => (
                  <tr key={cotizacion.id}>
                    <td className="numero-cell">
                      <strong>{cotizacion.numero}</strong>
                    </td>
                    <td>
                      <div className="cliente-info">
                        <div className="cliente-nombre">{cotizacion.cliente.nombre}</div>
                        {cotizacion.cliente.empresa && (
                          <div className="cliente-empresa">{cotizacion.cliente.empresa}</div>
                        )}
                      </div>
                    </td>
                    <td>{new Date(cotizacion.fecha).toLocaleDateString('es-MX')}</td>
                    <td className="monto-cell">{formatCurrency(cotizacion.total)}</td>
                    <td>
                      <span className={`badge ${getEstadoBadgeClass(cotizacion.estado)}`}>
                        {getEstadoLabel(cotizacion.estado)}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <Link to={`/cotizacion/${cotizacion.id}`} className="btn-action" title="Ver">
                          👁️
                        </Link>
                        <Link to={`/editar/${cotizacion.id}`} className="btn-action" title="Editar">
                          ✏️
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
