import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Cotizacion, Cliente, EstadisticasCotizaciones, FiltrosCotizacion } from '../types';
import { cotizacionesService, clientesService, configuracionService } from '../services/supabaseService';
import { useAuth } from './AuthContext';

interface ConfiguracionEmpresa {
  nombre: string;
  logo_url?: string;
  email: string;
  telefono: string;
  direccion: string;
  sitio_web?: string;
  desarrollador: {
    nombre: string;
    puesto: string;
    email?: string;
    telefono?: string;
  };
  terminos_defecto: {
    tiempoEntrega: string;
    formaPago: string;
    incluye: string;
    noIncluye: string;
    validez: string;
    garantia?: string;
  };
  impuestos: {
    iva: number;
    aplicarIVA: boolean;
  };
  metodos_pago_defecto: Array<{
    tipo: string;
    detalles: string[];
  }>;
}

interface CotizacionesContextType {
  // Cotizaciones
  cotizaciones: Cotizacion[];
  cotizacionActual: Cotizacion | null;
  setCotizacionActual: (cotizacion: Cotizacion | null) => void;
  agregarCotizacion: (cotizacion: Cotizacion) => Promise<void>;
  actualizarCotizacion: (cotizacion: Cotizacion) => Promise<void>;
  eliminarCotizacion: (id: string) => Promise<void>;
  obtenerCotizacion: (id: string) => Promise<Cotizacion | null>;

  // Clientes
  clientes: Cliente[];
  agregarCliente: (cliente: Cliente) => Promise<void>;
  actualizarCliente: (cliente: Cliente) => Promise<void>;
  eliminarCliente: (id: string) => Promise<void>;
  buscarClientes: (termino: string) => Promise<Cliente[]>;

  // Configuración
  configuracion: ConfiguracionEmpresa;
  actualizarConfiguracion: (config: ConfiguracionEmpresa) => Promise<void>;

  // Filtros y búsqueda
  filtros: FiltrosCotizacion;
  setFiltros: (filtros: FiltrosCotizacion) => void;
  cotizacionesFiltradas: Cotizacion[];

  // Estadísticas
  estadisticas: EstadisticasCotizaciones;

  // Estado de carga
  loading: boolean;

  // Utilidades
  generarNumeroCotizacion: () => Promise<string>;
  exportarDatos: () => string;
  importarDatos: (data: string) => Promise<boolean>;
}

const CotizacionesContext = createContext<CotizacionesContextType | undefined>(undefined);

export const useCotizaciones = () => {
  const context = useContext(CotizacionesContext);
  if (!context) {
    throw new Error('useCotizaciones debe usarse dentro de CotizacionesProvider');
  }
  return context;
};

interface CotizacionesProviderProps {
  children: ReactNode;
}

export const CotizacionesProvider: React.FC<CotizacionesProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionEmpresa>({
    nombre: 'Hidro_coding',
    email: '',
    telefono: '',
    direccion: '',
    desarrollador: {
      nombre: 'Desarrollador',
      puesto: 'Desarrollador Full-Stack'
    },
    terminos_defecto: {
      tiempoEntrega: 'El tiempo de entrega se establecerá según el alcance del proyecto.',
      formaPago: '50% al inicio del proyecto y 50% al finalizar, antes de la entrega final.',
      incluye: 'Desarrollo, pruebas y documentación básica.',
      noIncluye: 'Hosting, dominio y mantenimiento (pueden cotizarse por separado).',
      validez: 'Esta cotización tiene validez de 30 días naturales a partir de la fecha de emisión.'
    },
    impuestos: {
      iva: 16,
      aplicarIVA: false
    },
    metodos_pago_defecto: [
      {
        tipo: '💳 Transferencia Bancaria',
        detalles: [
          'Cuenta: 4152 3143 7919 5392',
          'Banco: BBVA México'
        ]
      }
    ]
  });
  const [cotizacionActual, setCotizacionActual] = useState<Cotizacion | null>(null);
  const [filtros, setFiltros] = useState<FiltrosCotizacion>({});
  const [loading, setLoading] = useState(true);

  // Cargar datos cuando el usuario está autenticado
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setCotizaciones([]);
      setClientes([]);
      setLoading(false);
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cotizacionesData, clientesData, configData] = await Promise.all([
        cotizacionesService.getAll(),
        clientesService.getAll(),
        configuracionService.get()
      ]);

      setCotizaciones(cotizacionesData);
      setClientes(clientesData);

      if (configData) {
        setConfiguracion({
          nombre: (configData as any).nombre,
          logo_url: (configData as any).logo_url || undefined,
          email: (configData as any).email || '',
          telefono: (configData as any).telefono || '',
          direccion: (configData as any).direccion || '',
          sitio_web: (configData as any).sitio_web || undefined,
          desarrollador: (configData as any).desarrollador as any,
          terminos_defecto: (configData as any).terminos_defecto as any,
          impuestos: (configData as any).impuestos as any,
          metodos_pago_defecto: (configData as any).metodos_pago_defecto as any
        });
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gestión de cotizaciones
  const agregarCotizacion = async (cotizacion: Cotizacion) => {
    try {
      await cotizacionesService.create(cotizacion);
      await loadData();
    } catch (error) {
      console.error('Error agregando cotización:', error);
      throw error;
    }
  };

  const actualizarCotizacion = async (cotizacion: Cotizacion) => {
    try {
      await cotizacionesService.update(cotizacion);
      await loadData();
    } catch (error) {
      console.error('Error actualizando cotización:', error);
      throw error;
    }
  };

  const eliminarCotizacion = async (id: string) => {
    try {
      await cotizacionesService.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error eliminando cotización:', error);
      throw error;
    }
  };

  const obtenerCotizacion = async (id: string): Promise<Cotizacion | null> => {
    try {
      return await cotizacionesService.getById(id);
    } catch (error) {
      console.error('Error obteniendo cotización:', error);
      return null;
    }
  };

  // Gestión de clientes
  const agregarCliente = async (cliente: Cliente) => {
    try {
      await clientesService.create(cliente);
      await loadData();
    } catch (error) {
      console.error('Error agregando cliente:', error);
      throw error;
    }
  };

  const actualizarCliente = async (cliente: Cliente) => {
    try {
      await clientesService.update(cliente);
      await loadData();
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      throw error;
    }
  };

  const eliminarCliente = async (id: string) => {
    try {
      await clientesService.delete(id);
      await loadData();
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      throw error;
    }
  };

  const buscarClientes = async (termino: string): Promise<Cliente[]> => {
    try {
      return await clientesService.buscar(termino);
    } catch (error) {
      console.error('Error buscando clientes:', error);
      return [];
    }
  };

  // Configuración
  const actualizarConfiguracion = async (config: ConfiguracionEmpresa) => {
    try {
      await configuracionService.update(config);
      setConfiguracion(config);
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      throw error;
    }
  };

  // Filtros
  const cotizacionesFiltradas = cotizaciones.filter(cotizacion => {
    if (filtros.estado && filtros.estado.length > 0 && !filtros.estado.includes(cotizacion.estado)) {
      return false;
    }

    if (filtros.fechaDesde && cotizacion.fecha < filtros.fechaDesde) {
      return false;
    }

    if (filtros.fechaHasta && cotizacion.fecha > filtros.fechaHasta) {
      return false;
    }

    if (filtros.cliente) {
      const clienteLower = filtros.cliente.toLowerCase();
      if (!cotizacion.cliente.nombre.toLowerCase().includes(clienteLower) &&
          !cotizacion.cliente.email.toLowerCase().includes(clienteLower)) {
        return false;
      }
    }

    if (filtros.busqueda) {
      const busquedaLower = filtros.busqueda.toLowerCase();
      return (
        cotizacion.numero.toLowerCase().includes(busquedaLower) ||
        cotizacion.cliente.nombre.toLowerCase().includes(busquedaLower) ||
        cotizacion.cliente.empresa?.toLowerCase().includes(busquedaLower) ||
        cotizacion.servicios.some(s =>
          s.nombre.toLowerCase().includes(busquedaLower) ||
          s.descripcion.toLowerCase().includes(busquedaLower)
        )
      );
    }

    return true;
  });

  // Estadísticas
  const estadisticas: EstadisticasCotizaciones = {
    total: cotizaciones.length,
    borradores: cotizaciones.filter(c => c.estado === 'borrador').length,
    enviadas: cotizaciones.filter(c => c.estado === 'enviada').length,
    aprobadas: cotizaciones.filter(c => c.estado === 'aprobada').length,
    rechazadas: cotizaciones.filter(c => c.estado === 'rechazada').length,
    vencidas: cotizaciones.filter(c => c.estado === 'vencida').length,
    montoTotal: cotizaciones.reduce((sum, c) => sum + c.total, 0),
    montoAprobado: cotizaciones.filter(c => c.estado === 'aprobada').reduce((sum, c) => sum + c.total, 0)
  };

  // Utilidades
  const generarNumeroCotizacion = async (): Promise<string> => {
    try {
      return await cotizacionesService.generateNumero();
    } catch (error) {
      console.error('Error generando número:', error);
      return `COT-${new Date().getFullYear()}-001`;
    }
  };

  const exportarDatos = (): string => {
    const data = {
      cotizaciones,
      clientes,
      configuracion,
      fecha: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importarDatos = async (jsonData: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonData);

      if (data.cotizaciones) {
        for (const c of data.cotizaciones) {
          await cotizacionesService.create(c);
        }
      }

      if (data.clientes) {
        for (const c of data.clientes) {
          await clientesService.create(c);
        }
      }

      if (data.configuracion) {
        await configuracionService.update(data.configuracion);
      }

      await loadData();
      return true;
    } catch (error) {
      console.error('Error importando datos:', error);
      return false;
    }
  };

  const value: CotizacionesContextType = {
    cotizaciones,
    cotizacionActual,
    setCotizacionActual,
    agregarCotizacion,
    actualizarCotizacion,
    eliminarCotizacion,
    obtenerCotizacion,
    clientes,
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
    buscarClientes,
    configuracion,
    actualizarConfiguracion,
    filtros,
    setFiltros,
    cotizacionesFiltradas,
    estadisticas,
    loading,
    generarNumeroCotizacion,
    exportarDatos,
    importarDatos
  };

  return (
    <CotizacionesContext.Provider value={value}>
      {children}
    </CotizacionesContext.Provider>
  );
};
