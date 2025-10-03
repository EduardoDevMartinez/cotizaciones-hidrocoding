import type { Cotizacion, Cliente } from '../types';

const STORAGE_KEYS = {
  COTIZACIONES: 'hidrocoding_cotizaciones',
  CLIENTES: 'hidrocoding_clientes',
  CONFIGURACION: 'hidrocoding_config',
  COUNTER: 'hidrocoding_counter'
};

// Utilidades generales de storage
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// Gestión de cotizaciones
export const cotizacionesStorage = {
  getAll: (): Cotizacion[] => {
    return storage.get<Cotizacion[]>(STORAGE_KEYS.COTIZACIONES) || [];
  },

  getById: (id: string): Cotizacion | null => {
    const cotizaciones = cotizacionesStorage.getAll();
    return cotizaciones.find(c => c.id === id) || null;
  },

  save: (cotizacion: Cotizacion): void => {
    const cotizaciones = cotizacionesStorage.getAll();
    const index = cotizaciones.findIndex(c => c.id === cotizacion.id);

    if (index >= 0) {
      cotizaciones[index] = { ...cotizacion, updatedAt: new Date().toISOString() };
    } else {
      cotizaciones.push(cotizacion);
    }

    storage.set(STORAGE_KEYS.COTIZACIONES, cotizaciones);
  },

  delete: (id: string): void => {
    const cotizaciones = cotizacionesStorage.getAll();
    const filtered = cotizaciones.filter(c => c.id !== id);
    storage.set(STORAGE_KEYS.COTIZACIONES, filtered);
  },

  generateNumero: (): string => {
    const year = new Date().getFullYear();
    const counter = storage.get<number>(STORAGE_KEYS.COUNTER) || 0;
    const newCounter = counter + 1;
    storage.set(STORAGE_KEYS.COUNTER, newCounter);
    return `COT-${year}-${String(newCounter).padStart(3, '0')}`;
  }
};

// Gestión de clientes
export const clientesStorage = {
  getAll: (): Cliente[] => {
    return storage.get<Cliente[]>(STORAGE_KEYS.CLIENTES) || [];
  },

  getById: (id: string): Cliente | null => {
    const clientes = clientesStorage.getAll();
    return clientes.find(c => c.id === id) || null;
  },

  save: (cliente: Cliente): void => {
    const clientes = clientesStorage.getAll();
    const index = clientes.findIndex(c => c.id === cliente.id);

    if (index >= 0) {
      clientes[index] = cliente;
    } else {
      clientes.push(cliente);
    }

    storage.set(STORAGE_KEYS.CLIENTES, clientes);
  },

  delete: (id: string): void => {
    const clientes = clientesStorage.getAll();
    const filtered = clientes.filter(c => c.id !== id);
    storage.set(STORAGE_KEYS.CLIENTES, filtered);
  },

  buscar: (termino: string): Cliente[] => {
    const clientes = clientesStorage.getAll();
    const terminoLower = termino.toLowerCase();
    return clientes.filter(c =>
      c.nombre.toLowerCase().includes(terminoLower) ||
      c.email.toLowerCase().includes(terminoLower) ||
      c.empresa?.toLowerCase().includes(terminoLower)
    );
  }
};

// Configuración global
export interface ConfiguracionEmpresa {
  nombre: string;
  logo?: string;
  email: string;
  telefono: string;
  direccion: string;
  sitioWeb?: string;
  desarrollador: {
    nombre: string;
    puesto: string;
    email?: string;
    telefono?: string;
  };
  terminosDefecto: {
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
  metodosPagoDefecto: Array<{
    tipo: string;
    detalles: string[];
  }>;
}

export const configuracionStorage = {
  get: (): ConfiguracionEmpresa => {
    const config = storage.get<ConfiguracionEmpresa>(STORAGE_KEYS.CONFIGURACION);
    return config || {
      nombre: 'Hidro_coding',
      email: 'contacto@hidrocoding.com',
      telefono: '',
      direccion: '',
      desarrollador: {
        nombre: 'Juan Eduardo Martinez Figueroa',
        puesto: 'Desarrollador Full-Stack'
      },
      terminosDefecto: {
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
      metodosPagoDefecto: [
        {
          tipo: '💳 Transferencia Bancaria',
          detalles: [
            'Cuenta: 4152 3143 7919 5392',
            'Banco: BBVA México'
          ]
        }
      ]
    };
  },

  save: (config: ConfiguracionEmpresa): void => {
    storage.set(STORAGE_KEYS.CONFIGURACION, config);
  }
};

// Utilidades de respaldo
export const backup = {
  exportar: (): string => {
    const data = {
      cotizaciones: cotizacionesStorage.getAll(),
      clientes: clientesStorage.getAll(),
      configuracion: configuracionStorage.get(),
      fecha: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  },

  importar: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);

      if (data.cotizaciones) {
        storage.set(STORAGE_KEYS.COTIZACIONES, data.cotizaciones);
      }
      if (data.clientes) {
        storage.set(STORAGE_KEYS.CLIENTES, data.clientes);
      }
      if (data.configuracion) {
        storage.set(STORAGE_KEYS.CONFIGURACION, data.configuracion);
      }

      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
};
