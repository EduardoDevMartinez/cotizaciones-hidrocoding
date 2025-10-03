-- ============================================
-- SCHEMA SUPABASE - SISTEMA DE COTIZACIONES
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: profiles (Perfiles de usuario)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  nombre_completo TEXT,
  empresa TEXT,
  telefono TEXT,
  puesto TEXT DEFAULT 'Desarrollador',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- TABLA: clientes
-- ============================================
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  empresa TEXT,
  direccion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para clientes
CREATE INDEX idx_clientes_user_id ON public.clientes(user_id);
CREATE INDEX idx_clientes_email ON public.clientes(email);

-- RLS para clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver sus propios clientes"
  ON public.clientes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propios clientes"
  ON public.clientes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propios clientes"
  ON public.clientes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propios clientes"
  ON public.clientes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TABLA: cotizaciones
-- ============================================
CREATE TABLE IF NOT EXISTS public.cotizaciones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  numero TEXT NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,

  -- Datos del cliente (denormalizado para histórico)
  cliente_nombre TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_telefono TEXT,
  cliente_empresa TEXT,
  cliente_direccion TEXT,

  -- Fechas
  fecha DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,

  -- Estado
  estado TEXT NOT NULL CHECK (estado IN ('borrador', 'enviada', 'aprobada', 'rechazada', 'vencida')),

  -- Montos
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  descuento DECIMAL(5, 2) NOT NULL DEFAULT 0,
  impuestos DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,

  -- Datos adicionales
  notas TEXT,
  terminos JSONB,
  metodos_pago JSONB,
  desarrollador JSONB,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para cotizaciones
CREATE INDEX idx_cotizaciones_user_id ON public.cotizaciones(user_id);
CREATE INDEX idx_cotizaciones_cliente_id ON public.cotizaciones(cliente_id);
CREATE INDEX idx_cotizaciones_numero ON public.cotizaciones(numero);
CREATE INDEX idx_cotizaciones_estado ON public.cotizaciones(estado);
CREATE INDEX idx_cotizaciones_fecha ON public.cotizaciones(fecha);

-- Constraint único para número de cotización por usuario
CREATE UNIQUE INDEX unique_numero_per_user ON public.cotizaciones(user_id, numero);

-- RLS para cotizaciones
ALTER TABLE public.cotizaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver sus propias cotizaciones"
  ON public.cotizaciones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar sus propias cotizaciones"
  ON public.cotizaciones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar sus propias cotizaciones"
  ON public.cotizaciones FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden eliminar sus propias cotizaciones"
  ON public.cotizaciones FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TABLA: servicios_cotizacion
-- ============================================
CREATE TABLE IF NOT EXISTS public.servicios_cotizacion (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cotizacion_id UUID REFERENCES public.cotizaciones(id) ON DELETE CASCADE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  categoria TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  unidad TEXT NOT NULL CHECK (unidad IN ('hora', 'proyecto', 'mes', 'unidad')),
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para servicios
CREATE INDEX idx_servicios_cotizacion_id ON public.servicios_cotizacion(cotizacion_id);

-- RLS para servicios (hereda permisos de cotización)
ALTER TABLE public.servicios_cotizacion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver servicios de sus cotizaciones"
  ON public.servicios_cotizacion FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.cotizaciones
      WHERE cotizaciones.id = servicios_cotizacion.cotizacion_id
      AND cotizaciones.user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden insertar servicios en sus cotizaciones"
  ON public.servicios_cotizacion FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.cotizaciones
      WHERE cotizaciones.id = servicios_cotizacion.cotizacion_id
      AND cotizaciones.user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden actualizar servicios de sus cotizaciones"
  ON public.servicios_cotizacion FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.cotizaciones
      WHERE cotizaciones.id = servicios_cotizacion.cotizacion_id
      AND cotizaciones.user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden eliminar servicios de sus cotizaciones"
  ON public.servicios_cotizacion FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.cotizaciones
      WHERE cotizaciones.id = servicios_cotizacion.cotizacion_id
      AND cotizaciones.user_id = auth.uid()
    )
  );

-- ============================================
-- TABLA: configuracion_empresa
-- ============================================
CREATE TABLE IF NOT EXISTS public.configuracion_empresa (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  nombre TEXT NOT NULL DEFAULT 'Hidro_coding',
  logo_url TEXT,
  email TEXT,
  telefono TEXT,
  direccion TEXT,
  sitio_web TEXT,
  desarrollador JSONB,
  terminos_defecto JSONB,
  impuestos JSONB,
  metodos_pago_defecto JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para configuración
ALTER TABLE public.configuracion_empresa ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su propia configuración"
  ON public.configuracion_empresa FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar su propia configuración"
  ON public.configuracion_empresa FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar su propia configuración"
  ON public.configuracion_empresa FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- TABLA: contador_cotizaciones
-- ============================================
CREATE TABLE IF NOT EXISTS public.contador_cotizaciones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  year INTEGER NOT NULL,
  contador INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, year)
);

-- RLS para contador
ALTER TABLE public.contador_cotizaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden ver su propio contador"
  ON public.contador_cotizaciones FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden insertar su propio contador"
  ON public.contador_cotizaciones FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden actualizar su propio contador"
  ON public.contador_cotizaciones FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cotizaciones_updated_at BEFORE UPDATE ON public.cotizaciones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracion_updated_at BEFORE UPDATE ON public.configuracion_empresa
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre_completo)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'nombre_completo');

  -- Crear configuración por defecto
  INSERT INTO public.configuracion_empresa (user_id, nombre, email, desarrollador, terminos_defecto, impuestos, metodos_pago_defecto)
  VALUES (
    NEW.id,
    'Hidro_coding',
    NEW.email,
    jsonb_build_object(
      'nombre', COALESCE(NEW.raw_user_meta_data->>'nombre_completo', 'Desarrollador'),
      'puesto', 'Desarrollador Full-Stack'
    ),
    jsonb_build_object(
      'tiempoEntrega', 'El tiempo de entrega se establecerá según el alcance del proyecto.',
      'formaPago', '50% al inicio del proyecto y 50% al finalizar, antes de la entrega final.',
      'incluye', 'Desarrollo, pruebas y documentación básica.',
      'noIncluye', 'Hosting, dominio y mantenimiento (pueden cotizarse por separado).',
      'validez', 'Esta cotización tiene validez de 30 días naturales a partir de la fecha de emisión.'
    ),
    jsonb_build_object(
      'iva', 16,
      'aplicarIVA', false
    ),
    jsonb_build_array(
      jsonb_build_object(
        'tipo', '💳 Transferencia Bancaria',
        'detalles', jsonb_build_array('Cuenta: 4152 3143 7919 5392', 'Banco: BBVA México')
      )
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil al registrarse
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista de estadísticas por usuario
CREATE OR REPLACE VIEW public.estadisticas_cotizaciones AS
SELECT
  user_id,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE estado = 'borrador') as borradores,
  COUNT(*) FILTER (WHERE estado = 'enviada') as enviadas,
  COUNT(*) FILTER (WHERE estado = 'aprobada') as aprobadas,
  COUNT(*) FILTER (WHERE estado = 'rechazada') as rechazadas,
  COUNT(*) FILTER (WHERE estado = 'vencida') as vencidas,
  COALESCE(SUM(total), 0) as monto_total,
  COALESCE(SUM(total) FILTER (WHERE estado = 'aprobada'), 0) as monto_aprobado
FROM public.cotizaciones
GROUP BY user_id;

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE public.profiles IS 'Perfiles de usuarios del sistema';
COMMENT ON TABLE public.clientes IS 'Clientes de cada usuario';
COMMENT ON TABLE public.cotizaciones IS 'Cotizaciones generadas';
COMMENT ON TABLE public.servicios_cotizacion IS 'Servicios incluidos en cada cotización';
COMMENT ON TABLE public.configuracion_empresa IS 'Configuración personalizada por usuario';
COMMENT ON TABLE public.contador_cotizaciones IS 'Contador automático de cotizaciones por año';
