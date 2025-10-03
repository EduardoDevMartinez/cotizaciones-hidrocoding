import type { PlantillaServicio } from '../types';

export const catalogoServicios: PlantillaServicio[] = [
  // Desarrollo Web
  {
    id: 'web-001',
    nombre: 'Diseño Web Responsivo',
    descripcion: 'Diseño personalizado para escritorio, tabletas y móviles con identidad visual profesional',
    categoria: 'desarrollo-web',
    precioBase: 8000,
    unidad: 'proyecto',
    duracionEstimada: '1-2 semanas',
    tags: ['diseño', 'responsive', 'UI/UX']
  },
  {
    id: 'web-002',
    nombre: 'Desarrollo Frontend Moderno',
    descripcion: 'Desarrollo con React/Vue/Angular, HTML5, CSS3, JavaScript con animaciones y efectos interactivos',
    categoria: 'desarrollo-web',
    precioBase: 12000,
    unidad: 'proyecto',
    duracionEstimada: '2-3 semanas',
    tags: ['react', 'frontend', 'javascript']
  },
  {
    id: 'web-003',
    nombre: 'Landing Page Profesional',
    descripcion: 'Página de aterrizaje optimizada para conversión con formularios y analytics',
    categoria: 'desarrollo-web',
    precioBase: 5000,
    unidad: 'proyecto',
    duracionEstimada: '1 semana',
    tags: ['landing', 'marketing', 'conversión']
  },
  {
    id: 'web-004',
    nombre: 'Sitio Web Corporativo',
    descripcion: 'Sitio web empresarial completo con múltiples secciones, blog y formularios de contacto',
    categoria: 'desarrollo-web',
    precioBase: 20000,
    unidad: 'proyecto',
    duracionEstimada: '3-4 semanas',
    tags: ['corporativo', 'cms', 'blog']
  },
  {
    id: 'web-005',
    nombre: 'E-commerce Completo',
    descripcion: 'Tienda en línea con catálogo de productos, carrito, pasarela de pago y panel de administración',
    categoria: 'desarrollo-web',
    precioBase: 35000,
    unidad: 'proyecto',
    duracionEstimada: '6-8 semanas',
    tags: ['ecommerce', 'tienda', 'pagos']
  },

  // Desarrollo Móvil
  {
    id: 'mov-001',
    nombre: 'App Móvil Híbrida',
    descripcion: 'Aplicación móvil con React Native o Flutter para iOS y Android',
    categoria: 'desarrollo-movil',
    precioBase: 40000,
    unidad: 'proyecto',
    duracionEstimada: '8-10 semanas',
    tags: ['mobile', 'react-native', 'flutter']
  },
  {
    id: 'mov-002',
    nombre: 'App Móvil Nativa',
    descripcion: 'Aplicación nativa para iOS (Swift) o Android (Kotlin)',
    categoria: 'desarrollo-movil',
    precioBase: 50000,
    unidad: 'proyecto',
    duracionEstimada: '10-12 semanas',
    tags: ['ios', 'android', 'nativo']
  },

  // Diseño
  {
    id: 'dis-001',
    nombre: 'Diseño de Identidad Visual',
    descripcion: 'Logotipo, paleta de colores, tipografía y guía de estilo de marca',
    categoria: 'diseno',
    precioBase: 8000,
    unidad: 'proyecto',
    duracionEstimada: '2-3 semanas',
    tags: ['branding', 'logo', 'identidad']
  },
  {
    id: 'dis-002',
    nombre: 'Diseño UI/UX',
    descripcion: 'Diseño de interfaz y experiencia de usuario con prototipos interactivos',
    categoria: 'diseno',
    precioBase: 10000,
    unidad: 'proyecto',
    duracionEstimada: '2-3 semanas',
    tags: ['ui', 'ux', 'figma']
  },

  // Consultoría
  {
    id: 'con-001',
    nombre: 'Consultoría Tecnológica',
    descripcion: 'Asesoría técnica, arquitectura de software y estrategia digital',
    categoria: 'consultoria',
    precioBase: 2000,
    unidad: 'hora',
    tags: ['asesoría', 'arquitectura', 'estrategia']
  },
  {
    id: 'con-002',
    nombre: 'Auditoría de Código',
    descripcion: 'Revisión exhaustiva de código, seguridad y mejores prácticas',
    categoria: 'consultoria',
    precioBase: 8000,
    unidad: 'proyecto',
    duracionEstimada: '1 semana',
    tags: ['auditoría', 'código', 'seguridad']
  },

  // Mantenimiento
  {
    id: 'man-001',
    nombre: 'Mantenimiento Web Mensual',
    descripcion: 'Soporte técnico, actualizaciones, respaldo y monitoreo continuo',
    categoria: 'mantenimiento',
    precioBase: 3000,
    unidad: 'mes',
    tags: ['soporte', 'actualizaciones', 'respaldo']
  },
  {
    id: 'man-002',
    nombre: 'Mantenimiento Anual Premium',
    descripcion: 'Soporte técnico prioritario, respaldo diario, actualizaciones y mejoras continuas',
    categoria: 'mantenimiento',
    precioBase: 30000,
    unidad: 'proyecto',
    duracionEstimada: '12 meses',
    tags: ['premium', 'anual', '24/7']
  },

  // Hosting y Dominio
  {
    id: 'hos-001',
    nombre: 'Hosting Compartido',
    descripcion: 'Alojamiento web compartido con SSL, email y panel de control',
    categoria: 'hosting',
    precioBase: 800,
    unidad: 'mes',
    tags: ['hosting', 'ssl', 'cpanel']
  },
  {
    id: 'hos-002',
    nombre: 'Hosting VPS',
    descripcion: 'Servidor virtual privado con recursos dedicados y mayor control',
    categoria: 'hosting',
    precioBase: 2500,
    unidad: 'mes',
    tags: ['vps', 'dedicado', 'escalable']
  },
  {
    id: 'hos-003',
    nombre: 'Registro de Dominio',
    descripcion: 'Registro de dominio .com, .mx u otros TLD por 1 año',
    categoria: 'hosting',
    precioBase: 500,
    unidad: 'proyecto',
    duracionEstimada: '1 año',
    tags: ['dominio', 'registro', 'dns']
  },

  // Seguridad
  {
    id: 'seg-001',
    nombre: 'Implementación de SSL',
    descripcion: 'Certificado SSL/TLS para sitio web seguro (HTTPS)',
    categoria: 'seguridad',
    precioBase: 1500,
    unidad: 'proyecto',
    duracionEstimada: '1 día',
    tags: ['ssl', 'https', 'seguridad']
  },
  {
    id: 'seg-002',
    nombre: 'Análisis de Vulnerabilidades',
    descripcion: 'Escaneo y análisis de vulnerabilidades de seguridad con reporte detallado',
    categoria: 'seguridad',
    precioBase: 6000,
    unidad: 'proyecto',
    duracionEstimada: '1 semana',
    tags: ['pentesting', 'vulnerabilidades', 'análisis']
  },

  // Base de Datos
  {
    id: 'db-001',
    nombre: 'Diseño de Base de Datos',
    descripcion: 'Modelado y diseño de base de datos relacional o NoSQL',
    categoria: 'base-de-datos',
    precioBase: 5000,
    unidad: 'proyecto',
    duracionEstimada: '1-2 semanas',
    tags: ['database', 'sql', 'modelado']
  },
  {
    id: 'db-002',
    nombre: 'Optimización de Base de Datos',
    descripcion: 'Análisis y optimización de consultas, índices y rendimiento',
    categoria: 'base-de-datos',
    precioBase: 4000,
    unidad: 'proyecto',
    duracionEstimada: '1 semana',
    tags: ['optimización', 'performance', 'queries']
  },

  // Integraciones
  {
    id: 'int-001',
    nombre: 'Integración de Pasarela de Pago',
    descripcion: 'Integración con Stripe, PayPal, Mercado Pago u otras pasarelas',
    categoria: 'integracion',
    precioBase: 4000,
    unidad: 'proyecto',
    duracionEstimada: '1 semana',
    tags: ['pagos', 'stripe', 'paypal']
  },
  {
    id: 'int-002',
    nombre: 'Integración OpenTable',
    descripcion: 'Sistema de reservaciones en línea integrado con OpenTable',
    categoria: 'integracion',
    precioBase: 3500,
    unidad: 'proyecto',
    duracionEstimada: '1 semana',
    tags: ['reservaciones', 'opentable', 'api']
  },
  {
    id: 'int-003',
    nombre: 'Integración API Personalizada',
    descripcion: 'Desarrollo e integración de API REST o GraphQL',
    categoria: 'integracion',
    precioBase: 6000,
    unidad: 'proyecto',
    duracionEstimada: '1-2 semanas',
    tags: ['api', 'rest', 'graphql']
  },
  {
    id: 'int-004',
    nombre: 'Integración CRM',
    descripcion: 'Integración con sistemas CRM como Salesforce, HubSpot o Zoho',
    categoria: 'integracion',
    precioBase: 5000,
    unidad: 'proyecto',
    duracionEstimada: '1-2 semanas',
    tags: ['crm', 'salesforce', 'hubspot']
  },

  // SEO y Marketing
  {
    id: 'seo-001',
    nombre: 'Optimización SEO Completa',
    descripcion: 'Meta etiquetas, sitemap, robots.txt, schema markup y optimización de velocidad',
    categoria: 'otro',
    precioBase: 4000,
    unidad: 'proyecto',
    duracionEstimada: '1-2 semanas',
    tags: ['seo', 'optimización', 'google']
  },
  {
    id: 'seo-002',
    nombre: 'Configuración de Analytics',
    descripcion: 'Implementación de Google Analytics, Tag Manager y seguimiento de conversiones',
    categoria: 'otro',
    precioBase: 2000,
    unidad: 'proyecto',
    duracionEstimada: '2-3 días',
    tags: ['analytics', 'tracking', 'conversiones']
  },

  // Multilingüe
  {
    id: 'multi-001',
    nombre: 'Sistema Multilingüe',
    descripcion: 'Implementación de sistema de traducción y cambio de idioma',
    categoria: 'desarrollo-web',
    precioBase: 3000,
    unidad: 'proyecto',
    duracionEstimada: '1 semana',
    tags: ['i18n', 'traducción', 'idiomas']
  }
];

export const getCategoriaLabel = (categoria: string): string => {
  const labels: Record<string, string> = {
    'desarrollo-web': 'Desarrollo Web',
    'desarrollo-movil': 'Desarrollo Móvil',
    'diseno': 'Diseño',
    'consultoria': 'Consultoría',
    'mantenimiento': 'Mantenimiento',
    'hosting': 'Hosting y Dominio',
    'seguridad': 'Seguridad',
    'base-de-datos': 'Base de Datos',
    'integracion': 'Integraciones',
    'otro': 'Otros'
  };
  return labels[categoria] || categoria;
};

export const getUnidadLabel = (unidad: string): string => {
  const labels: Record<string, string> = {
    'hora': 'por hora',
    'proyecto': 'por proyecto',
    'mes': 'mensual',
    'unidad': 'por unidad'
  };
  return labels[unidad] || unidad;
};
