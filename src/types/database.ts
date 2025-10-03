export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          nombre_completo: string | null
          empresa: string | null
          telefono: string | null
          puesto: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nombre_completo?: string | null
          empresa?: string | null
          telefono?: string | null
          puesto?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre_completo?: string | null
          empresa?: string | null
          telefono?: string | null
          puesto?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clientes: {
        Row: {
          id: string
          user_id: string
          nombre: string
          email: string
          telefono: string | null
          empresa: string | null
          direccion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nombre: string
          email: string
          telefono?: string | null
          empresa?: string | null
          direccion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nombre?: string
          email?: string
          telefono?: string | null
          empresa?: string | null
          direccion?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cotizaciones: {
        Row: {
          id: string
          user_id: string
          numero: string
          cliente_id: string
          cliente_nombre: string
          cliente_email: string
          cliente_telefono: string | null
          cliente_empresa: string | null
          cliente_direccion: string | null
          fecha: string
          fecha_vencimiento: string
          estado: 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida'
          subtotal: number
          descuento: number
          impuestos: number
          total: number
          notas: string | null
          terminos: Json | null
          tiempo_entrega: string | null
          forma_pago: string | null
          incluye: string | null
          no_incluye: string | null
          validez: string | null
          garantia: string | null
          metodos_pago: Json | null
          desarrollador: Json | null
          public_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          numero: string
          cliente_id: string
          cliente_nombre: string
          cliente_email: string
          cliente_telefono?: string | null
          cliente_empresa?: string | null
          cliente_direccion?: string | null
          fecha: string
          fecha_vencimiento: string
          estado: 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida'
          subtotal: number
          descuento: number
          impuestos: number
          total: number
          notas?: string | null
          terminos?: Json | null
          tiempo_entrega?: string | null
          forma_pago?: string | null
          incluye?: string | null
          no_incluye?: string | null
          validez?: string | null
          garantia?: string | null
          metodos_pago?: Json | null
          desarrollador?: Json | null
          public_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          numero?: string
          cliente_id?: string
          cliente_nombre?: string
          cliente_email?: string
          cliente_telefono?: string | null
          cliente_empresa?: string | null
          cliente_direccion?: string | null
          fecha?: string
          fecha_vencimiento?: string
          estado?: 'borrador' | 'enviada' | 'aprobada' | 'rechazada' | 'vencida'
          subtotal?: number
          descuento?: number
          impuestos?: number
          total?: number
          notas?: string | null
          terminos?: Json | null
          tiempo_entrega?: string | null
          forma_pago?: string | null
          incluye?: string | null
          no_incluye?: string | null
          validez?: string | null
          garantia?: string | null
          metodos_pago?: Json | null
          desarrollador?: Json | null
          public_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      servicios_cotizacion: {
        Row: {
          id: string
          cotizacion_id: string
          nombre: string
          descripcion: string
          categoria: string
          precio: number
          cantidad: number
          unidad: 'hora' | 'proyecto' | 'mes' | 'unidad'
          orden: number
          created_at: string
        }
        Insert: {
          id?: string
          cotizacion_id: string
          nombre: string
          descripcion: string
          categoria: string
          precio: number
          cantidad?: number
          unidad: 'hora' | 'proyecto' | 'mes' | 'unidad'
          orden?: number
          created_at?: string
        }
        Update: {
          id?: string
          cotizacion_id?: string
          nombre?: string
          descripcion?: string
          categoria?: string
          precio?: number
          cantidad?: number
          unidad?: 'hora' | 'proyecto' | 'mes' | 'unidad'
          orden?: number
          created_at?: string
        }
      }
      configuracion_empresa: {
        Row: {
          id: string
          user_id: string
          nombre: string
          logo_url: string | null
          email: string | null
          telefono: string | null
          direccion: string | null
          sitio_web: string | null
          desarrollador: Json | null
          terminos_defecto: Json | null
          impuestos: Json | null
          metodos_pago_defecto: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nombre?: string
          logo_url?: string | null
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          sitio_web?: string | null
          desarrollador?: Json | null
          terminos_defecto?: Json | null
          impuestos?: Json | null
          metodos_pago_defecto?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nombre?: string
          logo_url?: string | null
          email?: string | null
          telefono?: string | null
          direccion?: string | null
          sitio_web?: string | null
          desarrollador?: Json | null
          terminos_defecto?: Json | null
          impuestos?: Json | null
          metodos_pago_defecto?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      contador_cotizaciones: {
        Row: {
          id: string
          user_id: string
          year: number
          contador: number
        }
        Insert: {
          id?: string
          user_id: string
          year: number
          contador?: number
        }
        Update: {
          id?: string
          user_id?: string
          year?: number
          contador?: number
        }
      }
    }
    Views: {
      estadisticas_cotizaciones: {
        Row: {
          user_id: string
          total: number
          borradores: number
          enviadas: number
          aprobadas: number
          rechazadas: number
          vencidas: number
          monto_total: number
          monto_aprobado: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
