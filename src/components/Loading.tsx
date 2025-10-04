import React from 'react';
import '../styles/Loading.css';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({
  fullScreen = true,
  message = 'Cargando...'
}) => {
  if (fullScreen) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-logo">
              <span className="logo-bracket">{'<'}</span>
              <span className="logo-slash">/</span>
              <span className="logo-bracket">{'>'}</span>
            </div>
          </div>
          <p className="loading-message">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className="spinner-small">
        <div className="spinner-ring-small"></div>
        <div className="spinner-ring-small"></div>
      </div>
      <span className="loading-message-small">{message}</span>
    </div>
  );
};

export default Loading;
