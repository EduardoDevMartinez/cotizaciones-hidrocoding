import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { cotizacionesService } from '../services/supabaseService';
import Cotizacion from '../components/Cotizacion';
import type { CotizacionData } from '../components/Cotizacion';

const CotizacionPublica: React.FC = () => {
  const { token } = useParams();
  const printRef = useRef<HTMLDivElement>(null);
  const [cotizacion, setCotizacion] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadCotizacion = async () => {
      if (token) {
        try {
          const data = await cotizacionesService.getByPublicToken(token);
          if (data) {
            setCotizacion(data);
          } else {
            setError('Cotización no encontrada o el enlace ha expirado');
          }
        } catch (err) {
          console.error('Error cargando cotización:', err);
          setError('Error al cargar la cotización');
        }
      }
      setLoading(false);
    };

    loadCotizacion();
  }, [token]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <p style={{ color: '#546e7a', fontSize: '18px' }}>Cargando cotización...</p>
        </div>
      </div>
    );
  }

  if (error || !cotizacion) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          textAlign: 'center',
          background: 'white',
          padding: '60px 40px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ color: '#263238', marginBottom: '15px', fontSize: '24px' }}>
            {error || 'Cotización no encontrada'}
          </h2>
          <p style={{ color: '#546e7a', lineHeight: '1.6' }}>
            Este enlace puede haber expirado o no ser válido. Por favor, contacta con el emisor para obtener un nuevo enlace.
          </p>
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
      const fechaParts = cotizacion.fecha.split(/[-/]/);
      let year, month, day;

      if (fechaParts.length === 3) {
        if (fechaParts[0].length === 4) {
          [year, month, day] = fechaParts;
        } else {
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: '#00bcd4',
            fontSize: '28px',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            Vista de Cliente - Cotización {cotizacion.numero}
          </h1>
          <p style={{ color: '#546e7a', fontSize: '14px' }}>
            Esta es una vista de solo lectura de tu cotización
          </p>
        </div>

        <div ref={printRef}>
          <Cotizacion data={cotizacionData} />
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '25px',
          marginTop: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <p style={{ color: '#546e7a', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
            Si tienes alguna pregunta sobre esta cotización, por favor contacta directamente con nosotros.
          </p>
          <div style={{ color: '#263238', fontWeight: '600' }}>
            📧 {cotizacion.desarrollador.email || cotizacion.desarrollador.nombre}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CotizacionPublica;
