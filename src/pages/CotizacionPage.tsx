import React from 'react';
import Cotizacion from '../components/Cotizacion';
import type { CotizacionData } from '../components/Cotizacion';

const CotizacionPage: React.FC = () => {
  const cotizacionData: CotizacionData = {
    cliente: {
      nombre: "Carlos Arreguin",
      proyecto: "Página web El Jardín",
      dominio: "https://eljardinyeg.com/"
    },
    fecha: "2 de agosto de 2025",
    desarrollador: {
      nombre: "Juan Eduardo Martinez Figueroa",
      puesto: "Desarrollador Full-Stack"
    },
    monto: {
      subtotal: "$20,000.00",
      total: "$20,000.00 MXN"
    },
    servicios: [
      {
        id: "001",
        nombre: "Diseño Web Responsivo",
        descripcion: "Diseño personalizado para escritorio, tabletas y móviles con identidad visual profesional",
        precio: 3000,
        categoria: "diseno" as const,
        unidad: "proyecto" as const,
        cantidad: 1
      },
      {
        id: "002",
        nombre: "Desarrollo Frontend",
        descripcion: "Programación HTML5, CSS3, JavaScript con animaciones y efectos interactivos",
        precio: 5000,
        categoria: "desarrollo-web" as const,
        unidad: "proyecto" as const,
        cantidad: 1
      },
      {
        id: "003",
        nombre: "Integración OpenTable",
        descripcion: "Sistema de reservaciones en línea integrado con la plataforma OpenTable",
        precio: 2000,
        categoria: "integracion" as const,
        unidad: "proyecto" as const,
        cantidad: 1
      },
      {
        id: "004",
        nombre: "Integración Ackroo",
        descripcion: "Sistema de tarjetas de regalo digitales integrado con Ackroo",
        precio: 2000,
        categoria: "integracion" as const,
        unidad: "proyecto" as const,
        cantidad: 1
      },
      {
        id: "005",
        nombre: "Sistema Multilingüe",
        descripcion: "Soporte para 3 idiomas: español, inglés y francés con navegación intuitiva",
        precio: 3000,
        categoria: "desarrollo-web" as const,
        unidad: "proyecto" as const,
        cantidad: 1
      },
      {
        id: "006",
        nombre: "Secciones de Menú",
        descripcion: "Catálogos digitales para coctelería, comida, mezcales y vinos con galería",
        precio: 3000,
        categoria: "desarrollo-web" as const,
        unidad: "proyecto" as const,
        cantidad: 1
      },
      {
        id: "007",
        nombre: "Optimización SEO",
        descripcion: "Meta etiquetas, sitemap, robots.txt y optimización de velocidad",
        precio: 2000,
        categoria: "consultoria" as const,
        unidad: "proyecto" as const,
        cantidad: 1
      }
    ],
    metodosPago: [
      {
        tipo: "💳 Transferencia Bancaria",
        detalles: [
          "Cuenta: 4152 3143 7919 5392",
          "Banco: BBVA México"
        ]
      }
    ],
    terminos: {
      tiempoEntrega: "De 3 a 4 semanas a partir de la aprobación del diseño y la entrega de contenido (textos, imágenes, menús).",
      formaPago: "50% al inicio del proyecto ($10,000 MXN) y 50% al finalizar, antes de la entrega final ($10,000 MXN).",
      incluye: "Mantenimiento con soporte técnico, ajustes menores y respaldo mensual por un año.",
      noIncluye: "Hosting ni dominio (pueden cotizarse por separado si se requiere).",
      validez: "Esta cotización tiene validez de 30 días naturales a partir de la fecha de emisión."
    }
  };

  return <Cotizacion data={cotizacionData} />;
};

export default CotizacionPage;