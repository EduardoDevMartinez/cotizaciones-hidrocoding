# Instrucciones del Proyecto - Hidro_coding Cotizaciones

## Base de Datos - Supabase

### ⚠️ IMPORTANTE: Usar Supabase CLI

**SIEMPRE usar Supabase CLI** para cualquier operación de base de datos en lugar de acceder directamente.

- Proyecto conectado a Supabase remoto: `xvvgaewcrtasrlnvsfql`
- URL: `https://xvvgaewcrtasrlnvsfql.supabase.co`

### Comandos útiles de Supabase CLI:

```bash
# Verificar conexión y estado
supabase status

# Inspeccionar tablas y estadísticas
supabase inspect db table-stats

# Ver índices
supabase inspect db index-stats

# Ejecutar consultas SQL
supabase db query "SELECT * FROM cotizaciones LIMIT 5"

# Ver políticas RLS
supabase inspect db role-stats

# Generar tipos TypeScript actualizados
supabase gen types typescript --linked > src/types/database.ts

# Ver queries lentas
supabase inspect db long-running-queries

# Ver información de bloqueos
supabase inspect db locks
```

### Estructura de la Base de Datos

**Tablas principales:**

1. **profiles** - Perfiles de usuarios autenticados
   - Campos: id, email, nombre_completo, empresa, telefono, puesto, avatar_url

2. **clientes** - Catálogo de clientes
   - Campos: id, user_id, nombre, email, telefono, empresa, direccion

3. **cotizaciones** - Cotizaciones generadas
   - Campos principales: id, user_id, numero, cliente_id, fecha, fecha_vencimiento, estado
   - Montos: subtotal, descuento, impuestos, total
   - **Términos individuales**: tiempo_entrega, forma_pago, incluye, no_incluye, validez, garantia
   - JSONB: metodos_pago, desarrollador
   - **public_token**: Para compartir cotizaciones públicamente (anon access)
   - Campo legacy: `terminos` (JSONB - ya no se usa, migrado a campos individuales)

4. **servicios_cotizacion** - Items/servicios de cada cotización
   - Campos: id, cotizacion_id, nombre, descripcion, categoria, precio, cantidad, unidad, orden

5. **configuracion_empresa** - Configuración global del usuario
   - Campos: id, user_id, nombre, logo_url, contacto, terminos_defecto, impuestos, metodos_pago_defecto

6. **contador_cotizaciones** - Auto-incremento por usuario/año
   - Campos: id, user_id, year, contador

**Views:**
- `estadisticas_cotizaciones` - Agregaciones y métricas por usuario

### Políticas RLS Importantes

- Las cotizaciones con `public_token` son accesibles públicamente (rol `anon`)
- Los servicios de cotizaciones públicas también son accesibles vía `anon`

### Migraciones

- Las migraciones deben seguir el formato: `YYYYMMDDHHMMSS_nombre.sql`
- Archivos con formato incorrecto son ignorados por `supabase db pull`

## Stack Tecnológico

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Estilos:** CSS puro (sin frameworks)
- **PDF:** react-to-print
- **Routing:** React Router v6
- **State:** Context API

## Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── context/          # React Context (Auth, Cotizaciones)
├── data/             # Datos estáticos (servicios predefinidos)
├── lib/              # Configuración de librerías (supabase)
├── pages/            # Páginas/rutas
├── services/         # Servicios de API (supabaseService)
├── styles/           # CSS por componente
├── types/            # TypeScript types
└── utils/            # Utilidades
```

## Variables de Entorno

Archivo `.env`:
```
VITE_SUPABASE_URL=https://xvvgaewcrtasrlnvsfql.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Comandos de Desarrollo

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Linter
npm run lint

# Preview del build
npm run preview
```

## Notas de Desarrollo

### Loading States
- Usar el componente `<Loading />` para estados de carga
- Acepta props: `fullScreen` (boolean) y `message` (string)
- Incluye versión inline para usar dentro de componentes

### Autenticación
- Manejada por Supabase Auth
- Context: `AuthContext`
- ProtectedRoute wrapper para rutas privadas

### Generación de PDFs
- Usa `react-to-print` con refs
- Componente `Cotizacion` es printer-friendly

### Tokens Públicos
- Las cotizaciones pueden generar un `public_token` único
- Ruta pública: `/cotizacion/:token`
- No requiere autenticación (acceso anon)
