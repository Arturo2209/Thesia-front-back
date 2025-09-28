import React, { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';

const MisDocumentos: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedPhase, setSelectedPhase] = useState("Seleccionar Fase");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPhase, setFilterPhase] = useState("Todas las fases");

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Archivo seleccionado:", file.name);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="documentos-container">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="documentos-section">
          {/* Header */}
          <div className="documentos-header">
            <h2>Mis Documentos</h2>
            <p>Gestiona todas tus entregas y revisa el historial completo</p>
          </div>

          {/* Search and Filter */}
          <div className="search-filter-bar">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar por nombre de archivo o fase..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-box">
              <span className="filter-icon">📊</span>
              <select 
                value={filterPhase} 
                onChange={(e) => setFilterPhase(e.target.value)}
              >
                <option>Todas las fases</option>
                <option>Fase 1</option>
                <option>Fase 2</option>
                <option>Fase 3</option>
                <option>Fase 4</option>
                <option>Fase 5</option>
              </select>
            </div>
          </div>

          {/* Upload Section */}
          <div className="upload-section">
            <h3>Subir Nuevo Documento</h3>
            
            <div className="upload-form">
              <div className="form-group">
                <select 
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="phase-selector"
                >
                  <option>Seleccionar Fase</option>
                  <option>Fase 1 - Planteamiento del Problema</option>
                  <option>Fase 2 - Marco Teórico</option>
                  <option>Fase 3 - Metodología</option>
                  <option>Fase 4 - Desarrollo</option>
                  <option>Fase 5 - Resultados y Conclusiones</option>
                </select>
              </div>

              <div className="upload-area">
                <div className="upload-content">
                  <div className="upload-icon">📤</div>
                  <h4>Arrastra tu documento aquí</h4>
                  <p>O haz clic para seleccionar un archivo</p>
                  <button onClick={handleFileSelect} className="select-file-btn">
                    Seleccionar Archivo
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="upload-info">
                  <small>Formato PDF • Máximo 20 MB • Nomenclatura: Fase_NombreApellido_v1.pdf</small>
                </div>
              </div>
            </div>
          </div>

          {/* Documents History */}
          <div className="history-section">
            <h3>Historial de Entregas</h3>
            <div className="no-documents">
              <p>0 documentos encontrados</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .documentos-container {
          display: flex;
          min-height: 100vh;
          width: 100vw;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          overflow-x: hidden;
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          background: #f5f5f5;
          min-height: 100vh;
          width: calc(100vw - 280px);
        }

        .main-header {
          background: white;
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .main-header h1 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }

        .notification-icon {
          font-size: 20px;
          cursor: pointer;
        }

        .documentos-section {
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .documentos-header {
          margin-bottom: 32px;
        }

        .documentos-header h2 {
          color: #333;
          font-size: 28px;
          margin-bottom: 8px;
        }

        .documentos-header p {
          color: #666;
          font-size: 16px;
        }

        .search-filter-bar {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          margin-bottom: 32px;
        }

        .search-box,
        .filter-box {
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 12px 16px;
          gap: 8px;
        }

        .search-box input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 14px;
          background: transparent;
        }

        .filter-box select {
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          color: #333;
        }

        .search-icon,
        .filter-icon {
          color: #666;
        }

        .upload-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 32px;
        }

        .upload-section h3 {
          color: #333;
          margin-bottom: 24px;
          font-size: 18px;
        }

        .upload-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .phase-selector {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          background: #f8f9fa;
          color: #000;
        }

        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          background: #fafafa;
        }

        .upload-content {
          margin-bottom: 16px;
        }

        .upload-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .upload-content h4 {
          color: #333;
          margin-bottom: 8px;
          font-size: 18px;
        }

        .upload-content p {
          color: #666;
          margin-bottom: 16px;
        }

        .select-file-btn {
          background: #1976d2;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
        }

        .select-file-btn:hover {
          background: #1565c0;
        }

        .upload-info {
          border-top: 1px solid #eee;
          padding-top: 16px;
        }

        .upload-info small {
          color: #666;
          font-size: 12px;
        }

        .history-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .history-section h3 {
          color: #333;
          margin-bottom: 16px;
          font-size: 18px;
        }

        .no-documents {
          text-align: center;
          padding: 40px 20px;
          color: #666;
          font-style: italic;
        }

        @media (max-width: 1024px) {
          .main-content {
            margin-left: 240px;
            width: calc(100vw - 240px);
          }
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            width: 100vw;
          }
          
          .documentos-section {
            padding: 16px;
          }

          .search-filter-bar {
            grid-template-columns: 1fr;
          }

          .upload-section,
          .history-section {
            padding: 16px;
          }
        }

        @media (max-width: 480px) {
          .main-header {
            padding: 12px 16px;
          }
          
          .main-header h1 {
            font-size: 18px;
          }
          
          .documentos-section {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default MisDocumentos;