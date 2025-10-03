import { supabase } from '../lib/supabase';
import type { Cotizacion, Cliente, ServicioItem } from '../types';
import type { Database } from '../types/database';

type CotizacionRow = Database['public']['Tables']['cotizaciones']['Row'];
type CotizacionInsert = Database['public']['Tables']['cotizaciones']['Insert'];
type ClienteRow = Database['public']['Tables']['clientes']['Row'];
type ServicioRow = Database['public']['Tables']['servicios_cotizacion']['Row'];

// ============================================
// SERVICIOS DE COTIZACIONES
// ============================================

export const cotizacionesService = {
  // Obtener todas las cotizaciones del usuario
  async getAll(): Promise<Cotizacion[]> {
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('*, servicios_cotizacion(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(cotizacionRowToCotizacion);
  },

  // Obtener una cotización por ID
  async getById(id: string): Promise<Cotizacion | null> {
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('*, servicios_cotizacion(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return cotizacionRowToCotizacion(data);
  },

  // Crear una nueva cotizacion
  async create(cotizacion: Cotizacion): Promise<Cotizacion> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('No hay sesión activa');

    // Insertar la cotización
    const cotizacionInsert: CotizacionInsert = {
      id: cotizacion.id,
      user_id: session.session.user.id,
      numero: cotizacion.numero,
      cliente_id: cotizacion.cliente.id,
      cliente_nombre: cotizacion.cliente.nombre,
      cliente_email: cotizacion.cliente.email,
      cliente_telefono: cotizacion.cliente.telefono || null,
      cliente_empresa: cotizacion.cliente.empresa || null,
      cliente_direccion: cotizacion.cliente.direccion || null,
      fecha: cotizacion.fecha,
      fecha_vencimiento: cotizacion.fechaVencimiento,
      estado: cotizacion.estado,
      subtotal: cotizacion.subtotal,
      descuento: cotizacion.descuento,
      impuestos: cotizacion.impuestos,
      total: cotizacion.total,
      notas: cotizacion.notas || null,
      tiempo_entrega: cotizacion.terminos.tiempoEntrega || null,
      forma_pago: cotizacion.terminos.formaPago || null,
      incluye: cotizacion.terminos.incluye || null,
      no_incluye: cotizacion.terminos.noIncluye || null,
      validez: cotizacion.terminos.validez || null,
      garantia: cotizacion.terminos.garantia || null,
      metodos_pago: cotizacion.metodosPago as any,
      desarrollador: cotizacion.desarrollador as any
    };

    const { error: cotizacionError } = await supabase
      .from('cotizaciones')
      .insert(cotizacionInsert as any)
      .select()
      .single();

    if (cotizacionError) throw cotizacionError;

    // Insertar los servicios
    if (cotizacion.servicios.length > 0) {
      const serviciosInsert = cotizacion.servicios.map((servicio, index) => ({
        cotizacion_id: cotizacion.id,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        categoria: servicio.categoria,
        precio: servicio.precio,
        cantidad: servicio.cantidad,
        unidad: servicio.unidad,
        orden: index
      }));

      const { error: serviciosError } = await supabase
        .from('servicios_cotizacion')
        .insert(serviciosInsert as any);

      if (serviciosError) throw serviciosError;
    }

    return cotizacion;
  },

  // Actualizar una cotización
  async update(cotizacion: Cotizacion): Promise<Cotizacion> {
    const cotizacionUpdate: any = {
      numero: cotizacion.numero,
      cliente_id: cotizacion.cliente.id,
      cliente_nombre: cotizacion.cliente.nombre,
      cliente_email: cotizacion.cliente.email,
      cliente_telefono: cotizacion.cliente.telefono || null,
      cliente_empresa: cotizacion.cliente.empresa || null,
      cliente_direccion: cotizacion.cliente.direccion || null,
      fecha: cotizacion.fecha,
      fecha_vencimiento: cotizacion.fechaVencimiento,
      estado: cotizacion.estado,
      subtotal: cotizacion.subtotal,
      descuento: cotizacion.descuento,
      impuestos: cotizacion.impuestos,
      total: cotizacion.total,
      notas: cotizacion.notas || null,
      tiempo_entrega: cotizacion.terminos.tiempoEntrega || null,
      forma_pago: cotizacion.terminos.formaPago || null,
      incluye: cotizacion.terminos.incluye || null,
      no_incluye: cotizacion.terminos.noIncluye || null,
      validez: cotizacion.terminos.validez || null,
      garantia: cotizacion.terminos.garantia || null,
      metodos_pago: cotizacion.metodosPago,
      desarrollador: cotizacion.desarrollador
    };

    const { error: updateError } = await (supabase as any)
      .from('cotizaciones')
      .update(cotizacionUpdate)
      .eq('id', cotizacion.id);

    if (updateError) throw updateError;

    // Eliminar servicios anteriores
    await supabase
      .from('servicios_cotizacion')
      .delete()
      .eq('cotizacion_id', cotizacion.id);

    // Insertar servicios actualizados
    if (cotizacion.servicios.length > 0) {
      const serviciosInsert = cotizacion.servicios.map((servicio, index) => ({
        cotizacion_id: cotizacion.id,
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        categoria: servicio.categoria,
        precio: servicio.precio,
        cantidad: servicio.cantidad,
        unidad: servicio.unidad,
        orden: index
      }));

      const { error: serviciosError } = await supabase
        .from('servicios_cotizacion')
        .insert(serviciosInsert as any);

      if (serviciosError) throw serviciosError;
    }

    return cotizacion;
  },

  // Eliminar una cotización
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('cotizaciones')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Generar número de cotización
  async generateNumero(): Promise<string> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('No hay sesión activa');

    const year = new Date().getFullYear();

    // Obtener o crear contador para el año actual
    const { data: contador, error: contadorError } = await supabase
      .from('contador_cotizaciones')
      .select('contador')
      .eq('user_id', session.session.user.id)
      .eq('year', year)
      .single();

    let nuevoContador = 1;

    if (contadorError && contadorError.code !== 'PGRST116') {
      throw contadorError;
    }

    if (contador) {
      nuevoContador = (contador as any).contador + 1;
      await (supabase as any)
        .from('contador_cotizaciones')
        .update({ contador: nuevoContador })
        .eq('user_id', session.session.user.id)
        .eq('year', year);
    } else {
      await supabase
        .from('contador_cotizaciones')
        .insert({
          user_id: session.session.user.id,
          year,
          contador: nuevoContador
        } as any);
    }

    return `COT-${year}-${String(nuevoContador).padStart(3, '0')}`;
  },

  // Generar token público para compartir cotización
  async generatePublicToken(id: string): Promise<string> {
    const token = crypto.randomUUID();

    const { error } = await (supabase as any)
      .from('cotizaciones')
      .update({ public_token: token })
      .eq('id', id);

    if (error) throw error;

    return token;
  },

  // Obtener cotización por token público (sin autenticación)
  async getByPublicToken(token: string): Promise<Cotizacion | null> {
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('*, servicios_cotizacion(*)')
      .eq('public_token', token)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return cotizacionRowToCotizacion(data);
  }
};

// ============================================
// SERVICIOS DE CLIENTES
// ============================================

export const clientesService = {
  async getAll(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nombre');

    if (error) throw error;

    return data.map(clienteRowToCliente);
  },

  async getById(id: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return clienteRowToCliente(data);
  },

  async create(cliente: Cliente): Promise<Cliente> {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('No hay sesión activa');

    const { data, error } = await supabase
      .from('clientes')
      .insert({
        id: cliente.id,
        user_id: session.session.user.id,
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono || null,
        empresa: cliente.empresa || null,
        direccion: cliente.direccion || null
      } as any)
      .select()
      .single();

    if (error) throw error;

    return clienteRowToCliente(data);
  },

  async update(cliente: Cliente): Promise<Cliente> {
    const clienteUpdate: any = {
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono || null,
      empresa: cliente.empresa || null,
      direccion: cliente.direccion || null
    };

    const { data, error } = await (supabase as any)
      .from('clientes')
      .update(clienteUpdate)
      .eq('id', cliente.id)
      .select()
      .single();

    if (error) throw error;

    return clienteRowToCliente(data);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async buscar(termino: string): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .or(`nombre.ilike.%${termino}%,email.ilike.%${termino}%,empresa.ilike.%${termino}%`)
      .order('nombre');

    if (error) throw error;

    return data.map(clienteRowToCliente);
  }
};

// ============================================
// SERVICIOS DE CONFIGURACIÓN
// ============================================

export const configuracionService = {
  async get() {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('No hay sesión activa');

    const { data, error } = await supabase
      .from('configuracion_empresa')
      .select('*')
      .eq('user_id', session.session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data || null;
  },

  async update(config: any) {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('No hay sesión activa');

    const { data, error } = await supabase
      .from('configuracion_empresa')
      .upsert({
        user_id: session.session.user.id,
        ...config
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }
};

// ============================================
// FUNCIONES DE CONVERSIÓN
// ============================================

function cotizacionRowToCotizacion(row: CotizacionRow & { servicios_cotizacion: ServicioRow[] }): Cotizacion {
  return {
    id: row.id,
    numero: row.numero,
    cliente: {
      id: row.cliente_id,
      nombre: row.cliente_nombre,
      email: row.cliente_email,
      telefono: row.cliente_telefono || '',
      empresa: row.cliente_empresa || '',
      direccion: row.cliente_direccion || ''
    },
    fecha: row.fecha,
    fechaVencimiento: row.fecha_vencimiento,
    estado: row.estado as any,
    servicios: row.servicios_cotizacion
      .sort((a, b) => a.orden - b.orden)
      .map(servicioRowToServicio),
    subtotal: Number(row.subtotal),
    descuento: Number(row.descuento),
    impuestos: Number(row.impuestos),
    total: Number(row.total),
    metodosPago: (row.metodos_pago || []) as any,
    terminos: {
      tiempoEntrega: row.tiempo_entrega || '',
      formaPago: row.forma_pago || '',
      incluye: row.incluye || '',
      noIncluye: row.no_incluye || '',
      validez: row.validez || '',
      garantia: row.garantia || ''
    },
    notas: row.notas || undefined,
    desarrollador: row.desarrollador as any,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function servicioRowToServicio(row: ServicioRow): ServicioItem {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    precio: Number(row.precio),
    categoria: row.categoria as any,
    unidad: row.unidad,
    cantidad: row.cantidad
  };
}

function clienteRowToCliente(row: ClienteRow): Cliente {
  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    telefono: row.telefono || '',
    empresa: row.empresa || '',
    direccion: row.direccion || ''
  };
}
