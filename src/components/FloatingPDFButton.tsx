import React from 'react';
import { useReactToPrint } from 'react-to-print';

interface FloatingPDFButtonProps {
  printRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
}

const FloatingPDFButton: React.FC<FloatingPDFButtonProps> = ({
  printRef,
  fileName = 'cotizacion'
}) => {
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: fileName,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        .cotizacion-body {
          background: white !important;
          padding: 0 !important;
          min-height: auto !important;
        }
        .invoice-container {
          max-width: none !important;
          margin: 0 !important;
          box-shadow: none !important;
        }
      }
    `
  });

  const buttonStyles: React.CSSProperties = {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    width: '60px',
    height: '60px',
    backgroundColor: '#00bcd4',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    boxShadow: '0 4px 12px rgba(0, 188, 212, 0.3)',
    transition: 'all 0.3s ease',
    zIndex: 1000,
  };

  const hoverStyles: React.CSSProperties = {
    transform: 'scale(1.1)',
    backgroundColor: '#0097a7',
    boxShadow: '0 6px 16px rgba(0, 188, 212, 0.4)',
  };

  return (
    <button
      onClick={handlePrint}
      style={buttonStyles}
      onMouseEnter={(e) => {
        Object.assign(e.currentTarget.style, hoverStyles);
      }}
      onMouseLeave={(e) => {
        Object.assign(e.currentTarget.style, buttonStyles);
      }}
      title="Descargar PDF"
      aria-label="Descargar cotización en PDF"
    >
      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>PDF</span>
    </button>
  );
};

export default FloatingPDFButton;