import React, { useRef } from 'react';
import logo from '../assets/logos/logo.svg';
import FloatingPDFButton from './FloatingPDFButton';

export interface ServicioItem {
  id: string;
  title: string;
  description: string;
  cantidad: number;
  precio: number;
}

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
}

export interface CotizacionData {
  cliente: {
    nombre: string;
    proyecto: string;
    dominio: string;
  };
  fecha: string;
  desarrollador: {
    nombre: string;
    puesto: string;
  };
  monto: {
    subtotal: string;
    total: string;
  };
  servicios: ServicioItem[];
  metodosPago: MetodoPago[];
  terminos: TerminosCondiciones;
}

interface CotizacionProps {
  data: CotizacionData;
}

const Cotizacion: React.FC<CotizacionProps> = ({ data }) => {
  const printRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full font-sans">
      <div className="w-full bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden" id="cotizacion-content" ref={printRef}>
        {/* Header */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white p-8 md:p-6 sm:p-4 relative flex justify-between items-center md:flex-col md:text-center md:gap-4">
          <div className="text-3xl md:text-2xl sm:text-xl font-bold mb-3 md:mb-0 flex items-center gap-2.5 before:content-['<'] before:text-cyan-300 after:content-['/>'] after:text-cyan-300">
            Hidro_coding
          </div>
          <img src={logo} alt="Company Logo" className="w-20 h-20 md:w-16 md:h-16 sm:w-12 sm:h-12" />
        </div>

        {/* Main Content */}
        <div className="p-8 md:p-5 sm:p-4 text-gray-800">
          {/* Invoice Header */}
          <div className="flex justify-between gap-10 mb-10 pb-8 border-b-2 border-gray-200 md:flex-col md:gap-5">
            <div className="flex-1 text-left">
              <h3 className="text-cyan-500 mb-4 text-xl font-bold">Cotización para:</h3>
              <div className="leading-relaxed text-base mb-2.5">
                <strong>{data.cliente.nombre}</strong>
              </div>
              <div className="leading-relaxed text-base mb-2.5">
                <strong>Proyecto:</strong> {data.cliente.proyecto}
              </div>
              <div className="leading-relaxed text-base">
                <strong>Dominio:</strong> {data.cliente.dominio}
              </div>
            </div>
            <div className="flex-1 text-right md:text-left">
              <div className="leading-relaxed text-base mb-2.5">
                <strong>Fecha:</strong> {data.fecha}
              </div>
              <div className="leading-relaxed text-base">
                <strong>Desarrollador:</strong><br />
                {data.desarrollador.nombre}
              </div>
            </div>
          </div>

          {/* Services Table */}
          <table className="w-full border-collapse my-8 rounded-lg overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.1)]">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-500 to-cyan-600">
                <th className="text-white p-4 text-left font-bold">ID</th>
                <th className="text-white p-4 text-left font-bold">DESCRIPCIÓN DEL SERVICIO</th>
                <th className="text-white p-4 text-center font-bold">CANTIDAD</th>
                <th className="text-white p-4 text-center font-bold">PRECIO UNIT.</th>
                <th className="text-white p-4 text-center font-bold">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.servicios.map((servicio, index) => (
                <tr key={servicio.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-cyan-50`}>
                  <td className="p-4 border-b border-gray-200 text-gray-800">{servicio.id}</td>
                  <td className="p-4 border-b border-gray-200 text-gray-800">
                    <strong>{servicio.title}</strong><br />
                    {servicio.description}
                  </td>
                  <td className="p-4 border-b border-gray-200 text-gray-800 text-center font-semibold">{servicio.cantidad}</td>
                  <td className="p-4 border-b border-gray-200 text-gray-800 text-center font-semibold">
                    ${servicio.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 border-b border-gray-200 text-gray-800 text-center font-bold">
                    ${servicio.precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              <tr className="bg-cyan-50 border-t-2 border-cyan-500">
                <td colSpan={4} className="p-4 text-right font-bold text-gray-800">TOTAL GENERAL:</td>
                <td className="p-4 text-center font-bold text-cyan-600 text-lg">
                  ${data.servicios.reduce((sum, servicio) => sum + servicio.precio, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Summary Section */}
          <div className="grid grid-cols-[1fr_350px] gap-10 mt-10 md:grid-cols-1">
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-cyan-500 text-gray-800">
              <h4 className="text-cyan-500 mb-5 text-base font-bold tracking-wide">MÉTODOS DE PAGO ACEPTADOS</h4>
              {data.metodosPago.map((metodo, index) => (
                <div key={index} className="my-4 leading-relaxed">
                  <strong>{metodo.tipo}</strong><br />
                  {metodo.detalles.map((detalle, i) => (
                    <span key={i}>{detalle}<br /></span>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-gray-800 border-2 border-cyan-500">
              <div className="flex justify-between my-2.5 py-1">
                <span>Subtotal:</span>
                <span>{data.monto.subtotal}</span>
              </div>
              <div className="flex justify-between my-2.5 py-1 border-t-2 border-cyan-500 font-bold text-lg text-cyan-500 mt-4 pt-4">
                <span>TOTAL:</span>
                <span>{data.monto.total}</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-cyan-50 p-8 rounded-xl my-10 border-l-4 border-cyan-500 text-gray-800">
            <h4 className="text-cyan-500 mb-5 text-base font-bold tracking-wide">TÉRMINOS Y CONDICIONES</h4>
            <p className="leading-relaxed my-3"><strong>Tiempo de Entrega:</strong> {data.terminos.tiempoEntrega}</p>
            <p className="leading-relaxed my-3"><strong>Forma de Pago:</strong> {data.terminos.formaPago}</p>
            <p className="leading-relaxed my-3"><strong>Incluye:</strong> {data.terminos.incluye}</p>
            <p className="leading-relaxed my-3"><strong>No Incluye:</strong> {data.terminos.noIncluye}</p>
            <p className="leading-relaxed my-3"><strong>Validez:</strong> {data.terminos.validez}</p>
          </div>

          {/* Signature */}
          <div className="text-right my-8 text-gray-800">
            <p><strong>{data.desarrollador.nombre}</strong></p>
            <p>{data.desarrollador.puesto}</p>
            <div className="border-t-2 border-cyan-500 w-52 my-5 ml-auto"></div>
            <p className="italic mt-2.5">Firma del Desarrollador</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-white p-8 md:p-6 text-center">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="text-lg font-bold">&lt;Hidro_coding/&gt;</div>
            <div>Gracias por confiar en nuestros servicios</div>
          </div>
        </div>
      </div>
      <FloatingPDFButton
        printRef={printRef}
        fileName={`cotizacion-${data.cliente.nombre.replace(/\s+/g, '-').toLowerCase()}`}
      />
    </div>
  );
};

export default Cotizacion;
