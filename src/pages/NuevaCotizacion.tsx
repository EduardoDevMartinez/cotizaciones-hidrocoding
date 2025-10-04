import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCotizaciones } from '../context/CotizacionesContext';
import type { Cotizacion, ServicioItem, Cliente, EstadoCotizacion } from '../types';
import '../styles/NuevaCotizacion.css';

const NuevaCotizacion: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { agregarCotizacion, actualizarCotizacion, obtenerCotizacion, generarNumeroCotizacion, configuracion, agregarCliente, actualizarCliente } = useCotizaciones();

  const [isEditing] = useState(!!id);
  const [numero, setNumero] = useState('');
  const [cliente, setCliente] = useState<Cliente>({
    id: crypto.randomUUID(),
    nombre: '',
    email: '',
    telefono: '',
    empresa: '',
    direccion: ''
  });

  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [estado, setEstado] = useState<EstadoCotizacion>('borrador');
  const [servicios, setServicios] = useState<ServicioItem[]>([]);
  const [notas, setNotas] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [terminos, setTerminos] = useState({
    tiempoEntrega: '',
    formaPago: '',
    incluye: '',
    noIncluye: '',
    validez: '',
    garantia: ''
  });
  const [mostrarModalServicio, setMostrarModalServicio] = useState(false);
  const [servicioEnEdicion, setServicioEnEdicion] = useState<string | null>(null);
  const [servicioTemp, setServicioTemp] = useState<ServicioItem>({
    id: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: 'desarrollo-web',
    unidad: 'hora',
    cantidad: 1,
    tiempo: ''
  });

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        const cotizacion = await obtenerCotizacion(id);
        if (cotizacion) {
          setNumero(cotizacion.numero);
          setCliente(cotizacion.cliente);
          setFecha(cotizacion.fecha);
          setFechaVencimiento(cotizacion.fechaVencimiento);
          setEstado(cotizacion.estado);
          setServicios(cotizacion.servicios);
          setNotas(cotizacion.notas || '');
          setDescuento(cotizacion.descuento);
          setTerminos({
            tiempoEntrega: cotizacion.terminos.tiempoEntrega,
            formaPago: cotizacion.terminos.formaPago,
            incluye: cotizacion.terminos.incluye,
            noIncluye: cotizacion.terminos.noIncluye,
            validez: cotizacion.terminos.validez,
            garantia: cotizacion.terminos.garantia || ''
          });
        }
      } else {
        const num = await generarNumeroCotizacion();
        setNumero(num);
        const fechaVenc = new Date();
        fechaVenc.setDate(fechaVenc.getDate() + 30);
        setFechaVencimiento(fechaVenc.toISOString().split('T')[0]);
        // Cargar términos por defecto de la configuración
        setTerminos({
          tiempoEntrega: configuracion.terminos_defecto.tiempoEntrega,
          formaPago: configuracion.terminos_defecto.formaPago,
          incluye: configuracion.terminos_defecto.incluye,
          noIncluye: configuracion.terminos_defecto.noIncluye,
          validez: configuracion.terminos_defecto.validez,
          garantia: configuracion.terminos_defecto.garantia || ''
        });
      }
    };

    loadData();
  }, [id, configuracion]);

  const abrirModalServicio = () => {
    setServicioTemp({
      id: crypto.randomUUID(),
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: 'desarrollo-web',
      unidad: 'hora',
      cantidad: 1,
      tiempo: ''
    });
    setServicioEnEdicion(null);
    setMostrarModalServicio(true);
  };

  const abrirEdicionServicio = (servicio: ServicioItem) => {
    setServicioTemp(servicio);
    setServicioEnEdicion(servicio.id);
    setMostrarModalServicio(true);
  };

  const cerrarModalServicio = () => {
    setMostrarModalServicio(false);
    setServicioEnEdicion(null);
  };

  const guardarServicio = () => {
    if (!servicioTemp.nombre.trim()) {
      alert('El nombre del servicio es requerido');
      return;
    }

    if (servicioEnEdicion) {
      // Editar servicio existente
      setServicios(servicios.map(s => s.id === servicioEnEdicion ? servicioTemp : s));
    } else {
      // Agregar nuevo servicio
      setServicios([...servicios, servicioTemp]);
    }

    setMostrarModalServicio(false);
    setServicioEnEdicion(null);
  };

  const eliminarServicio = (id: string) => {
    setServicios(servicios.filter(s => s.id !== id));
  };

  const calcularTotales = () => {
    const subtotal = servicios.reduce((sum, s) => sum + s.precio, 0);
    const montoDescuento = subtotal * (descuento / 100);
    const subtotalConDescuento = subtotal - montoDescuento;
    const impuestos = configuracion.impuestos.aplicarIVA
      ? subtotalConDescuento * (configuracion.impuestos.iva / 100)
      : 0;
    const total = subtotalConDescuento + impuestos;

    return { subtotal, montoDescuento, subtotalConDescuento, impuestos, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cliente.nombre || !cliente.email || servicios.length === 0) {
      alert('Por favor completa los datos del cliente y agrega al menos un servicio');
      return;
    }

    try {
      const totales = calcularTotales();

      let createdAt = new Date().toISOString();
      if (id) {
        const existing = await obtenerCotizacion(id);
        createdAt = existing?.createdAt || createdAt;
      }

      // Guardar o actualizar el cliente primero
      if (isEditing) {
        await actualizarCliente(cliente);
      } else {
        await agregarCliente(cliente);
      }

      const cotizacion: Cotizacion = {
        id: id || crypto.randomUUID(),
        numero,
        cliente,
        fecha,
        fechaVencimiento,
        estado,
        servicios,
        subtotal: totales.subtotal,
        descuento,
        impuestos: totales.impuestos,
        total: totales.total,
        metodosPago: configuracion.metodos_pago_defecto,
        terminos: terminos as any,
        notas,
        desarrollador: configuracion.desarrollador,
        createdAt,
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        await actualizarCotizacion(cotizacion);
      } else {
        await agregarCotizacion(cotizacion);
      }

      navigate('/cotizaciones');
    } catch (error) {
      console.error('Error guardando cotización:', error);
      alert('Error al guardar la cotización. Por favor intenta de nuevo.');
    }
  };

  const totales = calcularTotales();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  return (
    <div className="nueva-cotizacion">
      <div className="form-header">
        <h1>{isEditing ? 'Editar Cotización' : 'Nueva Cotización'}</h1>
        <button type="button" onClick={() => navigate('/cotizaciones')} className="btn btn-secondary">
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-section">
            <h2>Información General</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Número de Cotización</label>
                <input type="text" value={numero} readOnly className="input-readonly" />
              </div>
              <div className="form-group">
                <label>Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                  className="date-input"
                />
              </div>
              <div className="form-group">
                <label>Fecha de Vencimiento</label>
                <input
                  type="date"
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                  required
                  className="date-input"
                />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={estado} onChange={(e) => setEstado(e.target.value as EstadoCotizacion)}>
                  <option value="borrador">Borrador</option>
                  <option value="enviada">Enviada</option>
                  <option value="aprobada">Aprobada</option>
                  <option value="rechazada">Rechazada</option>
                  <option value="vencida">Vencida</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Información del Cliente</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={cliente.nombre}
                  onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={cliente.email}
                  onChange={(e) => setCliente({ ...cliente, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  value={cliente.telefono}
                  onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Empresa</label>
                <input
                  type="text"
                  value={cliente.empresa}
                  onChange={(e) => setCliente({ ...cliente, empresa: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                value={cliente.direccion}
                onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })}
              />
            </div>
          </div>

          <div className="form-section full-width">
            <div className="section-header">
              <h2>Servicios</h2>
              <button type="button" onClick={abrirModalServicio} className="btn btn-primary">
                + Agregar Servicio
              </button>
            </div>

            {mostrarModalServicio && (
              <div className="modal-servicio-overlay" onClick={cerrarModalServicio}>
                <div className="modal-servicio-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-servicio-header">
                    <h3>{servicioEnEdicion ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}</h3>
                    <button type="button" onClick={cerrarModalServicio} className="btn-close">✕</button>
                  </div>

                  <div className="modal-servicio-body">
                    <div className="form-group">
                      <label>Nombre del Servicio *</label>
                      <input
                        type="text"
                        value={servicioTemp.nombre}
                        onChange={(e) => setServicioTemp({ ...servicioTemp, nombre: e.target.value })}
                        placeholder="Ej: Desarrollo de sitio web"
                        autoFocus
                      />
                    </div>

                    <div className="form-group">
                      <label>Descripción</label>
                      <textarea
                        value={servicioTemp.descripcion}
                        onChange={(e) => setServicioTemp({ ...servicioTemp, descripcion: e.target.value })}
                        rows={3}
                        placeholder="Describe los detalles del servicio..."
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Precio</label>
                        <input
                          type="number"
                          value={servicioTemp.precio}
                          onChange={(e) => setServicioTemp({ ...servicioTemp, precio: parseFloat(e.target.value) || 0 })}
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="form-group">
                        <label>Horas</label>
                        <input
                          type="number"
                          value={servicioTemp.cantidad}
                          onChange={(e) => setServicioTemp({ ...servicioTemp, cantidad: parseInt(e.target.value) || 1 })}
                          min="1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-servicio-footer">
                    <button type="button" onClick={cerrarModalServicio} className="btn btn-secondary">
                      Cancelar
                    </button>
                    <button type="button" onClick={guardarServicio} className="btn btn-primary">
                      Guardar Servicio
                    </button>
                  </div>
                </div>
              </div>
            )}

            {servicios.length === 0 ? (
              <div className="empty-servicios">
                <p>No hay servicios agregados. Haz clic en "Agregar Servicio" para comenzar.</p>
              </div>
            ) : (
              <div className="servicios-list">
                {servicios.map((servicio, index) => (
                  <div key={servicio.id} className="servicio-card">
                    <div className="servicio-card-header">
                      <div className="servicio-badge">{index + 1}</div>
                      <div className="servicio-info">
                        <h4 className="servicio-nombre">{servicio.nombre}</h4>
                        <p className="servicio-descripcion">{servicio.descripcion}</p>
                      </div>
                      <div className="servicio-actions">
                        <button type="button" onClick={() => abrirEdicionServicio(servicio)} className="btn-edit-servicio" title="Editar">
                          ✏️
                        </button>
                        <button type="button" onClick={() => eliminarServicio(servicio.id)} className="btn-delete-servicio" title="Eliminar">
                          ✕
                        </button>
                      </div>
                    </div>
                    <div className="servicio-card-footer">
                      <div className="servicio-detalle">
                        <span className="servicio-detalle-label">Precio:</span>
                        <span className="servicio-detalle-value">{formatCurrency(servicio.precio)}</span>
                      </div>
                      <div className="servicio-detalle">
                        <span className="servicio-detalle-label">Horas:</span>
                        <span className="servicio-detalle-value">{servicio.cantidad}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-section full-width">
            <h2>Totales</h2>
            <div className="totales-grid">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatCurrency(totales.subtotal)}</span>
              </div>
              {configuracion.impuestos.aplicarIVA && (
                <div className="total-row">
                  <span>IVA ({configuracion.impuestos.iva}%):</span>
                  <span>{formatCurrency(totales.impuestos)}</span>
                </div>
              )}
              <div className="total-row final">
                <span>TOTAL:</span>
                <span>{formatCurrency(totales.total)}</span>
              </div>
            </div>
          </div>

          <div className="form-section full-width">
            <h2>Notas</h2>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={4}
              placeholder="Notas adicionales para esta cotización..."
            />
          </div>

          <div className="form-section full-width">
            <h2>Términos y Condiciones</h2>
            <div className="form-group">
              <label>Tiempo de Entrega</label>
              <input
                type="text"
                value={terminos.tiempoEntrega}
                onChange={(e) => setTerminos({ ...terminos, tiempoEntrega: e.target.value })}
                placeholder="Ej: 30 días hábiles"
              />
            </div>
            <div className="form-group">
              <label>Forma de Pago</label>
              <textarea
                value={terminos.formaPago}
                onChange={(e) => setTerminos({ ...terminos, formaPago: e.target.value })}
                rows={2}
                placeholder="Ej: 50% al inicio y 50% al finalizar"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Incluye</label>
                <textarea
                  value={terminos.incluye}
                  onChange={(e) => setTerminos({ ...terminos, incluye: e.target.value })}
                  rows={3}
                  placeholder="Qué incluye este servicio..."
                />
              </div>
              <div className="form-group">
                <label>No Incluye</label>
                <textarea
                  value={terminos.noIncluye}
                  onChange={(e) => setTerminos({ ...terminos, noIncluye: e.target.value })}
                  rows={3}
                  placeholder="Qué no incluye este servicio..."
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Validez de la Cotización</label>
                <input
                  type="text"
                  value={terminos.validez}
                  onChange={(e) => setTerminos({ ...terminos, validez: e.target.value })}
                  placeholder="Ej: 30 días naturales"
                />
              </div>
              <div className="form-group">
                <label>Garantía (Opcional)</label>
                <input
                  type="text"
                  value={terminos.garantia}
                  onChange={(e) => setTerminos({ ...terminos, garantia: e.target.value })}
                  placeholder="Ej: 3 meses de garantía"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/cotizaciones')} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Actualizar Cotización' : 'Crear Cotización'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevaCotizacion;
