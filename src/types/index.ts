// Tipos base
export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  direccion?: string;
}

export interface ServicioItem {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: CategoriaServicio;
  unidad: 'hora' | 'proyecto' | 'mes' | 'unidad';
  cantidad: number;
  tiempo?: string;
}

export type CategoriaServicio =
  | 'desarrollo-web'
  | 'desarrollo-movil'
  | 'diseno'
  | 'consultoria'
  | 'mantenimiento'
  | 'hosting'
  | 'seguridad'
  | 'base-de-datos'
  | 'integracion'
  | 'otro';

export interface MetodoPago {
  tipo: string;
  detalles: string[];
}

export interface TerminosCondiciones {
  tiempoEntrega: string;
  formaPago: string;
  incluye: string;
  noIncluye: string;
  validez: string;
  garantia?: string;
}

export type EstadoCotizacion = 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida';

export interface Cotizacion {
  id: string;
  numero: string; // Número de cotización (ej: COT-2024-001)
  cliente: Cliente;
  fecha: string;
  fechaVencimiento: string;
  estado: EstadoCotizacion;
  servicios: ServicioItem[];
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  metodosPago: MetodoPago[];
  terminos: TerminosCondiciones;
  notas?: string;
  desarrollador: {
    nombre: string;
    puesto: string;
    email?: string;
    telefono?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PlantillaServicio {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaServicio;
  precioBase: number;
  unidad: 'hora' | 'proyecto' | 'mes' | 'unidad';
  duracionEstimada?: string;
  tags?: string[];
}

export interface FiltrosCotizacion {
  estado?: EstadoCotizacion[];
  fechaDesde?: string;
  fechaHasta?: string;
  cliente?: string;
  busqueda?: string;
}

export interface EstadisticasCotizaciones {
  total: number;
  borradores: number;
  enviadas: number;
  aprobadas: number;
  rechazadas: number;
  vencidas: number;
  montoTotal: number;
  montoAprobado: number;
}
