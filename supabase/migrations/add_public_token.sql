-- Add public_token column to cotizaciones table
ALTER TABLE public.cotizaciones
ADD COLUMN IF NOT EXISTS public_token text UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_cotizaciones_public_token ON public.cotizaciones(public_token);

-- Update RLS policy to allow public access with valid token
CREATE POLICY "Allow public read access with valid token"
ON public.cotizaciones
FOR SELECT
TO anon
USING (public_token IS NOT NULL);

-- Allow read access to servicios_cotizacion for public cotizaciones
CREATE POLICY "Allow public read access to services with valid token"
ON public.servicios_cotizacion
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM public.cotizaciones
    WHERE cotizaciones.id = servicios_cotizacion.cotizacion_id
    AND cotizaciones.public_token IS NOT NULL
  )
);
