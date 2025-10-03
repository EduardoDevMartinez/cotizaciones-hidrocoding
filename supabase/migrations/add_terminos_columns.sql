-- Agregar columnas individuales para términos y condiciones
ALTER TABLE public.cotizaciones
ADD COLUMN IF NOT EXISTS tiempo_entrega TEXT,
ADD COLUMN IF NOT EXISTS forma_pago TEXT,
ADD COLUMN IF NOT EXISTS incluye TEXT,
ADD COLUMN IF NOT EXISTS no_incluye TEXT,
ADD COLUMN IF NOT EXISTS validez TEXT,
ADD COLUMN IF NOT EXISTS garantia TEXT;

-- Migrar datos existentes del campo JSONB 'terminos' a las nuevas columnas
UPDATE public.cotizaciones
SET
  tiempo_entrega = terminos->>'tiempoEntrega',
  forma_pago = terminos->>'formaPago',
  incluye = terminos->>'incluye',
  no_incluye = terminos->>'noIncluye',
  validez = terminos->>'validez',
  garantia = terminos->>'garantia'
WHERE terminos IS NOT NULL;

-- Opcional: Eliminar la columna JSONB antigua (descomentar si deseas eliminarla)
-- ALTER TABLE public.cotizaciones DROP COLUMN terminos;
