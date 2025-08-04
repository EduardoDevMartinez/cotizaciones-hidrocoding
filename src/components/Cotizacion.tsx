import React, { useRef } from 'react';
import logo from '../assets/logos/logo.svg';
import FloatingPDFButton from './FloatingPDFButton';

export interface ServicioItem {
  id: string;
  title: string;
  description: string;
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
  
  const styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .cotizacion-body {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
      min-height: 100vh;
    }

    @media (max-width: 480px) {
      .cotizacion-body {
        padding: 10px;
      }
    }

    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
      color: white;
      padding: 30px;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    @media (max-width: 768px) {
      .header {
        padding: 20px;
        flex-direction: column;
        text-align: center;
        gap: 15px;
      }
    }

    @media (max-width: 480px) {
      .header {
        padding: 15px;
      }
    }

    .header::after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      width: 0;
      height: 0;
      border-left: 60px solid transparent;
      border-top: 60px solid rgba(255,255,255,0.1);
    }

    .logo {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .company-logo {
      width: 80px;
      height: 80px;
    }

    @media (max-width: 768px) {
      .logo {
        font-size: 24px;
        margin-bottom: 0;
      }
      
      .company-logo {
        width: 60px;
        height: 60px;
      }
    }

    @media (max-width: 480px) {
      .logo {
        font-size: 20px;
      }
      
      .company-logo {
        width: 50px;
        height: 50px;
      }
    }

    .logo::before {
      content: '<';
      color: #00e5ff;
    }

    .logo::after {
      content: '/>';
      color: #00e5ff;
    }

    .company-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
    }

    .info-icon {
      width: 20px;
      height: 20px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .main-content {
      padding: 30px;
      color: #333;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 20px;
      }
    }

    @media (max-width: 480px) {
      .main-content {
        padding: 15px;
      }
    }

    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
    }

    .client-info h3 {
      color: #00bcd4;
      margin-bottom: 10px;
      font-size: 18px;
    }

    .invoice-details {
      text-align: right;
    }

    .invoice-title {
      background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 15px;
      display: inline-block;
    }

    .total-amount {
      font-size: 32px;
      color: #00bcd4;
      font-weight: bold;
      margin: 20px 0;
    }

    @media (max-width: 768px) {
      .total-amount {
        font-size: 28px;
        text-align: center;
      }
    }

    @media (max-width: 480px) {
      .total-amount {
        font-size: 24px;
      }
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .items-table th {
      background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: bold;
    }

    .items-table td {
      padding: 15px;
      border-bottom: 1px solid #eee;
      color: #333;
    }

    .items-table tr:nth-child(even) {
      background: #f8f9fa;
    }

    .items-table tr:hover {
      background: #e1f5fe;
    }

    @media (max-width: 768px) {
      .items-table {
        font-size: 14px;
      }
      
      .items-table th,
      .items-table td {
        padding: 10px 8px;
      }
    }

    @media (max-width: 480px) {
      .items-table {
        font-size: 12px;
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      }
      
      .items-table thead {
        display: block;
      }
      
      .items-table tbody {
        display: block;
      }
      
      .items-table tr {
        display: block;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 10px;
        background: white;
        white-space: normal;
      }
      
      .items-table th {
        display: none;
      }
      
      .items-table td {
        display: block;
        text-align: left !important;
        border: none;
        padding: 5px 0;
        position: relative;
        padding-left: 30%;
      }
      
      .items-table td:before {
        position: absolute;
        left: 6px;
        width: 25%;
        padding-right: 10px;
        white-space: nowrap;
        font-weight: bold;
        color: #00bcd4;
      }
      
      .items-table td:nth-child(1):before {
        content: "ID: ";
      }
      
      .items-table td:nth-child(2):before {
        content: "Servicio: ";
      }
    }

    .summary-section {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 30px;
      margin-top: 30px;
    }

    .payment-methods {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      border-left: 4px solid #00bcd4;
      color: #333;
    }

    .payment-methods h4 {
      color: #00bcd4;
      margin-bottom: 15px;
    }

    .totals {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      color: #333;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      padding: 5px 0;
    }

    .total-row.final {
      border-top: 2px solid #00bcd4;
      font-weight: bold;
      font-size: 18px;
      color: #00bcd4;
      margin-top: 15px;
      padding-top: 15px;
    }

    .terms {
      background: #e1f5fe;
      padding: 20px;
      border-radius: 10px;
      margin: 30px 0;
      border-left: 4px solid #00bcd4;
      color: #333;
    }

    .terms h4 {
      color: #00bcd4;
      margin-bottom: 15px;
    }

    .footer {
      background: #263238;
      color: white;
      padding: 20px 30px;
      text-align: center;
    }

    .signature-section {
      text-align: right;
      margin: 30px 0;
      color: #333;
    }

    .signature-line {
      border-top: 2px solid #00bcd4;
      width: 200px;
      margin: 20px 0 10px auto;
    }

    @media print {
      .cotizacion-body {
        background: white !important;
        padding: 0 !important;
        min-height: auto !important;
      }

      .invoice-container {
        max-width: none !important;
        margin: 0 !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }

      .header {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .items-table {
        page-break-inside: auto;
      }

      .items-table tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }

      .terms {
        page-break-inside: avoid;
      }

      .signature-section {
        page-break-inside: avoid;
      }

      .footer {
        page-break-inside: avoid;
      }
    }

    @media (max-width: 768px) {
      .invoice-header {
        flex-direction: column;
        gap: 20px;
      }

      .invoice-details {
        text-align: left;
      }

      .summary-section {
        grid-template-columns: 1fr;
      }

      .company-info {
        grid-template-columns: 1fr;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="cotizacion-body">
        <div className="invoice-container" id="cotizacion-content" ref={printRef}>
          <div className="header">
            <div className="logo">Hidro_coding</div>
            <img src={logo} alt="Company Logo" className="company-logo" />
          </div>

          <div className="main-content">
            <div className="invoice-header">
              <div className="client-info">
                <h3>Cotización para:</h3>
                <div style={{ marginBottom: "10px" }}>
                  <strong>{data.cliente.nombre}</strong>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <strong>Proyecto:</strong> {data.cliente.proyecto}
                </div>
                <div>
                  <strong>Dominio:</strong> {data.cliente.dominio}
                </div>
              </div>
              <div className="invoice-details">
                <div style={{ marginBottom: "10px" }}>
                  <strong>Fecha:</strong> {data.fecha}
                </div>
                <div>
                  <strong>Desarrollador:</strong><br />
                  {data.desarrollador.nombre}
                </div>
              </div>
            </div>

            <div className="total-amount">
              TOTAL: {data.monto.total}
            </div>

            <table className="items-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DESCRIPCIÓN DEL SERVICIO</th>
                </tr>
              </thead>
              <tbody>
                {data.servicios.map((servicio) => (
                  <tr key={servicio.id}>
                    <td>{servicio.id}</td>
                    <td>
                      <strong>{servicio.title}</strong><br />
                      {servicio.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="summary-section">
              <div className="payment-methods">
                <h4>MÉTODOS DE PAGO ACEPTADOS</h4>
                {data.metodosPago.map((metodo, index) => (
                  <div key={index} style={{ margin: "15px 0" }}>
                    <strong>{metodo.tipo}</strong><br />
                    {metodo.detalles.map((detalle, i) => (
                      <span key={i}>{detalle}<br /></span>
                    ))}
                  </div>
                ))}
              </div>

              <div className="totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{data.monto.subtotal}</span>
                </div>
                <div className="total-row final">
                  <span>TOTAL:</span>
                  <span>{data.monto.total}</span>
                </div>
              </div>
            </div>

            <div className="terms">
              <h4>TÉRMINOS Y CONDICIONES</h4>
              <p><strong>Tiempo de Entrega:</strong> {data.terminos.tiempoEntrega}</p>
              <br />
              <p><strong>Forma de Pago:</strong> {data.terminos.formaPago}</p>
              <br />
              <p><strong>Incluye:</strong> {data.terminos.incluye}</p>
              <br />
              <p><strong>No Incluye:</strong> {data.terminos.noIncluye}</p>
              <br />
              <p><strong>Validez:</strong> {data.terminos.validez}</p>
            </div>

            <div className="signature-section">
              <p><strong>{data.desarrollador.nombre}</strong></p>
              <p>{data.desarrollador.puesto}</p>
              <div className="signature-line"></div>
              <p style={{ fontStyle: "italic", marginTop: "10px" }}>Firma del Desarrollador</p>
            </div>
          </div>

          <div className="footer">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>&lt;Hidro_coding/&gt;</div>
              <div>Gracias por confiar en nuestros servicios</div>
            </div>
          </div>
        </div>
        <FloatingPDFButton 
          printRef={printRef}
          fileName={`cotizacion-${data.cliente.nombre.replace(/\s+/g, '-').toLowerCase()}`}
        />
      </div>
    </>
  );
};

export default Cotizacion;