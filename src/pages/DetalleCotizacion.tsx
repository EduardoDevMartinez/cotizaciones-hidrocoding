import React, { useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useCotizaciones } from '../context/CotizacionesContext';
import { cotizacionesService } from '../services/supabaseService';
import Cotizacion from '../components/Cotizacion';
import Loading from '../components/Loading';
import type { CotizacionData } from '../components/Cotizacion';
import '../styles/DetalleCotizacion.css';

const DetalleCotizacion: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { obtenerCotizacion, eliminarCotizacion, actualizarCotizacion } = useCotizaciones();
  const printRef = useRef<HTMLDivElement>(null);
  const [cotizacion, setCotizacion] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [publicToken, setPublicToken] = React.useState<string | null>(null);
  const [copiedLink, setCopiedLink] = React.useState(false);

  React.useEffect(() => {
    const loadCotizacion = async () => {
      if (id) {
        const data = await obtenerCotizacion(id);
        setCotizacion(data);
      }
      setLoading(false);
    };

    loadCotizacion();
  }, [id, obtenerCotizacion]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `cotizacion-${cotizacion?.numero}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `
  });

  const handleEliminar = async () => {
    if (cotizacion && window.confirm(`¿Estás seguro de eliminar la cotización ${cotizacion.numero}?`)) {
      try {
        await eliminarCotizacion(cotizacion.id);
        navigate('/cotizaciones');
      } catch (error) {
        console.error('Error eliminando:', error);
        alert('Error al eliminar la cotización');
      }
    }
  };

  const handleCambiarEstado = async (nuevoEstado: string) => {
    if (cotizacion) {
      try {
        await actualizarCotizacion({
          ...cotizacion,
          estado: nuevoEstado as any,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error cambiando estado:', error);
        alert('Error al cambiar el estado');
      }
    }
  };

  const handleGenerarLinkPublico = async () => {
    if (cotizacion) {
      try {
        const token = await cotizacionesService.generatePublicToken(cotizacion.id);
        setPublicToken(token);

        const publicUrl = `${window.location.origin}/cotizacion/publica/${token}`;
        await navigator.clipboard.writeText(publicUrl);

        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      } catch (error) {
        console.error('Error generando link público:', error);
        alert('Error al generar el link público');
      }
    }
  };

  const handleCopiarLink = async () => {
    if (publicToken) {
      const publicUrl = `${window.location.origin}/cotizacion/publica/${publicToken}`;
      await navigator.clipboard.writeText(publicUrl);

      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  if (loading) {
    return <Loading message="Cargando cotización..." />;
  }

  if (!cotizacion) {
    return (
      <div className="detalle-cotizacion">
        <div className="not-found">
          <h2>Cotización no encontrada</h2>
          <Link to="/cotizaciones" className="btn btn-primary">
            Volver a Cotizaciones
          </Link>
        </div>
      </div>
    );
  }

  // Convertir al formato de CotizacionData
  const cotizacionData: CotizacionData = {
    cliente: {
      nombre: cotizacion.cliente.nombre,
      proyecto: cotizacion.cliente.empresa || 'Proyecto',
      dominio: cotizacion.cliente.email
    },
    fecha: (() => {
      // Asegurarse de parsear correctamente la fecha
      const fechaParts = cotizacion.fecha.split(/[-/]/);
      let year, month, day;

      if (fechaParts.length === 3) {
        // Formato puede ser YYYY-MM-DD o DD/MM/YYYY
        if (fechaParts[0].length === 4) {
          // YYYY-MM-DD
          [year, month, day] = fechaParts;
        } else {
          // DD/MM/YYYY o MM/DD/YYYY
          [day, month, year] = fechaParts;
        }

        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }

      return cotizacion.fecha;
    })(),
    desarrollador: cotizacion.desarrollador,
    monto: {
      subtotal: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cotizacion.subtotal),
      total: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cotizacion.total)
    },
    servicios: cotizacion.servicios.map((s: any, index: number) => ({
      id: String(index + 1).padStart(3, '0'),
      title: s.nombre,
      description: s.descripcion,
      cantidad: s.cantidad
    })),
    metodosPago: cotizacion.metodosPago,
    terminos: cotizacion.terminos
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
    <div className="detalle-cotizacion">
      <div className="detalle-header">
        <div className="header-info">
          <button onClick={() => navigate('/cotizaciones')} className="btn-back">
            ← Volver
          </button>
          <div className="title-section">
            <h1>Cotización {cotizacion.numero}</h1>
            <span className={`badge ${getEstadoBadgeClass(cotizacion.estado)}`}>
              {getEstadoLabel(cotizacion.estado)}
            </span>
          </div>
        </div>

        <div className="header-actions">
          <div className="estado-actions">
            {cotizacion.estado === 'borrador' && (
              <button onClick={() => handleCambiarEstado('enviada')} className="btn btn-outline">
                📤 Marcar como Enviada
              </button>
            )}
            {cotizacion.estado === 'enviada' && (
              <>
                <button onClick={() => handleCambiarEstado('aprobada')} className="btn btn-success">
                  ✅ Aprobar
                </button>
                <button onClick={() => handleCambiarEstado('rechazada')} className="btn btn-danger">
                  ✕ Rechazar
                </button>
              </>
            )}
          </div>

          <div className="main-actions">
            {!publicToken ? (
              <button onClick={handleGenerarLinkPublico} className="btn btn-success">
                🔗 Compartir con Cliente
              </button>
            ) : (
              <button onClick={handleCopiarLink} className="btn btn-success">
                {copiedLink ? '✓ Link Copiado!' : '📋 Copiar Link'}
              </button>
            )}
            <button onClick={handlePrint} className="btn btn-primary">
              📄 Descargar PDF
            </button>
            <Link to={`/editar/${cotizacion.id}`} className="btn btn-outline">
              ✏️ Editar
            </Link>
            <button onClick={handleEliminar} className="btn btn-danger">
              ✕ Eliminar
            </button>
          </div>
        </div>
      </div>

      <div className="detalle-content" ref={printRef}>
        <Cotizacion data={cotizacionData} />
      </div>

      {cotizacion.notas && (
        <div className="notas-section">
          <h3>Notas Internas</h3>
          <p>{cotizacion.notas}</p>
        </div>
      )}

      <div className="info-adicional">
        <div className="info-card">
          <div className="info-label">Cliente</div>
          <div className="info-value">{cotizacion.cliente.nombre}</div>
          {cotizacion.cliente.empresa && (
            <div className="info-subvalue">{cotizacion.cliente.empresa}</div>
          )}
          <div className="info-subvalue">{cotizacion.cliente.email}</div>
          {cotizacion.cliente.telefono && (
            <div className="info-subvalue">{cotizacion.cliente.telefono}</div>
          )}
        </div>

        <div className="info-card">
          <div className="info-label">Fechas</div>
          <div className="info-value">
            Creada: {new Date(cotizacion.createdAt).toLocaleDateString('es-MX')}
          </div>
          <div className="info-subvalue">
            Vence: {new Date(cotizacion.fechaVencimiento).toLocaleDateString('es-MX')}
          </div>
          <div className="info-subvalue">
            Última actualización: {new Date(cotizacion.updatedAt).toLocaleDateString('es-MX')}
          </div>
        </div>

        <div className="info-card">
          <div className="info-label">Totales</div>
          <div className="info-value">
            {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cotizacion.total)}
          </div>
          <div className="info-subvalue">
            Subtotal: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cotizacion.subtotal)}
          </div>
          {cotizacion.descuento > 0 && (
            <div className="info-subvalue">
              Descuento: {cotizacion.descuento}%
            </div>
          )}
          {cotizacion.impuestos > 0 && (
            <div className="info-subvalue">
              Impuestos: {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cotizacion.impuestos)}
            </div>
          )}
        </div>

        <div className="info-card">
          <div className="info-label">Servicios</div>
          <div className="info-value">{cotizacion.servicios.length} servicios</div>
          <div className="servicios-list-mini">
            {cotizacion.servicios.map((servicio: any, index: number) => (
              <div key={index} className="servicio-mini">
                • {servicio.nombre}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleCotizacion;
