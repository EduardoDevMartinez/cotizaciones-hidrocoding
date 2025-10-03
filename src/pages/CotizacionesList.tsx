import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCotizaciones } from '../context/CotizacionesContext';
import type { EstadoCotizacion } from '../types';
import '../styles/CotizacionesList.css';

const CotizacionesList: React.FC = () => {
  const { cotizacionesFiltradas, filtros, setFiltros, eliminarCotizacion } = useCotizaciones();
  const [busquedaLocal, setBusquedaLocal] = useState(filtros.busqueda || '');

  const handleBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    setFiltros({ ...filtros, busqueda: busquedaLocal });
  };

  const handleEstadoFilter = (estado: EstadoCotizacion) => {
    const estadosActuales = filtros.estado || [];
    const nuevosFiltros = estadosActuales.includes(estado)
      ? estadosActuales.filter(e => e !== estado)
      : [...estadosActuales, estado];

    setFiltros({ ...filtros, estado: nuevosFiltros.length > 0 ? nuevosFiltros : undefined });
  };

  const limpiarFiltros = () => {
    setBusquedaLocal('');
    setFiltros({});
  };

  const handleEliminar = async (id: string, numero: string) => {
    if (window.confirm(`¿Estás seguro de eliminar la cotización ${numero}?`)) {
      try {
        await eliminarCotizacion(id);
      } catch (error) {
        console.error('Error eliminando cotización:', error);
        alert('Error al eliminar la cotización');
      }
    }
  };

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

  const estados: EstadoCotizacion[] = ['borrador', 'enviada', 'aprobada', 'rechazada', 'vencida'];

  return (
    <div className="cotizaciones-list">
      <div className="list-header">
        <h1>Cotizaciones</h1>
        <Link to="/nueva-cotizacion" className="btn btn-primary">
          <span className="icon">+</span>
          Nueva Cotización
        </Link>
      </div>

      <div className="filters-section">
        <form onSubmit={handleBusqueda} className="search-form">
          <input
            type="text"
            placeholder="Buscar por número, cliente, servicios..."
            value={busquedaLocal}
            onChange={(e) => setBusquedaLocal(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-search">🔍</button>
        </form>

        <div className="estado-filters">
          {estados.map(estado => (
            <button
              key={estado}
              onClick={() => handleEstadoFilter(estado)}
              className={`filter-btn ${filtros.estado?.includes(estado) ? 'active' : ''} ${getEstadoBadgeClass(estado)}`}
            >
              {getEstadoLabel(estado)}
            </button>
          ))}
          {(filtros.busqueda || filtros.estado?.length) && (
            <button onClick={limpiarFiltros} className="btn-clear-filters">
              Limpiar filtros ✕
            </button>
          )}
        </div>
      </div>

      <div className="results-info">
        Mostrando {cotizacionesFiltradas.length} cotización{cotizacionesFiltradas.length !== 1 ? 'es' : ''}
      </div>

      {cotizacionesFiltradas.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No se encontraron cotizaciones</h3>
          <p>Intenta ajustar los filtros o crear una nueva cotización</p>
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
                <th>Vencimiento</th>
                <th>Servicios</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cotizacionesFiltradas.map((cotizacion) => (
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
                  <td>{new Date(cotizacion.fechaVencimiento).toLocaleDateString('es-MX')}</td>
                  <td>
                    <div className="servicios-count">
                      {cotizacion.servicios.length} servicio{cotizacion.servicios.length !== 1 ? 's' : ''}
                    </div>
                  </td>
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
                      <button
                        onClick={() => handleEliminar(cotizacion.id, cotizacion.numero)}
                        className="btn-action btn-delete"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CotizacionesList;
