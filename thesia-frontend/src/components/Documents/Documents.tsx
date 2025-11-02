import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import MyDocuments from './components/MyDocuments';
import UploadDocument from './components/UploadDocument';
import DocumentDetail from './components/DocumentDetail';
import DocumentHistory from './components/DocumentHistory'; // ✅ NUEVO IMPORT
import authService from '../../services/authService';

type TabType = 'my-documents' | 'upload' | 'history';

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estados principales
  const [activeTab, setActiveTab] = useState<TabType>('my-documents');
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Leer tab desde URL al cargar
  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['my-documents', 'upload', 'history'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Actualizar URL cuando cambia el tab
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedDocumentId(null); // Cerrar vista detallada
    setSearchParams({ tab });
  };

  // Ver detalles de un documento
  const handleViewDocument = (documentId: number) => {
    setSelectedDocumentId(documentId);
  };

  // Volver a la lista
  const handleBackToList = () => {
    setSelectedDocumentId(null);
  };

  // Refrescar lista después de acciones
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // Si estamos viendo detalles de un documento, mostrar esa vista
  if (selectedDocumentId) {
    return (
      <div className="documents-container">
        <Sidebar onLogout={handleLogout} />
        <div className="main-content">
          <DocumentDetail 
            documentId={selectedDocumentId}
            onBack={handleBackToList}
            onRefresh={handleRefresh}
          />
        </div>
        <style>{documentsStyles}</style>
      </div>
    );
  }

  return (
    <div className="student-documents-container">
      <Sidebar onLogout={handleLogout} />
      
      <div className="main-content">
        <header className="main-header">
          <h1>Mis Documentos</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="content-section">
          <div className="documents-header">
            <h2>Gestión de Documentos</h2>
            <p>Sube, revisa y administra los documentos de tu tesis</p>
          </div>

          <div className="tabs-container">
            <div className="tabs-nav">
              <button 
                className={`tab-button ${activeTab === 'my-documents' ? 'active' : ''}`}
                onClick={() => handleTabChange('my-documents')}
              >
                <span className="tab-icon">📁</span>
                <span className="tab-text">Mis Documentos</span>
              </button>
              
              <button 
                className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => handleTabChange('upload')}
              >
                <span className="tab-icon">📤</span>
                <span className="tab-text">Subir Documento</span>
              </button>
              
              <button 
                className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => handleTabChange('history')}
              >
                <span className="tab-icon">📚</span>
                <span className="tab-text">Historial</span>
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'my-documents' && (
                <MyDocuments 
                  onViewDocument={handleViewDocument}
                  refreshTrigger={refreshTrigger}
                  onRefresh={handleRefresh}
                />
              )}
              
              {activeTab === 'upload' && (
                <UploadDocument 
                  onUploadSuccess={() => {
                    handleRefresh();
                    handleTabChange('my-documents');
                  }}
                />
              )}
              
              {activeTab === 'history' && (
                <DocumentHistory 
                  onViewDocument={handleViewDocument}
                  refreshTrigger={refreshTrigger}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{documentsStyles}</style>
    </div>
  );
};

const documentsStyles = `
  .student-documents-container {
    display: flex;
    min-height: 100vh;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .main-content {
    flex: 1;
    margin-left: 280px; /* Espacio reservado para el sidebar */
    background: #f5f5f5;
    padding: 32px;
    box-sizing: border-box;
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

  .content-section {
    padding: 32px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .documents-header {
    margin-bottom: 24px;
  }

  .documents-header h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 8px;
  }

  .documents-header p {
    font-size: 16px;
    color: #666;
  }

  .tabs-container {
    margin-top: 16px;
  }

  .tabs-nav {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }

  .tab-button {
    background: #fff;
    border: 1px solid #ddd;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tab-button.active {
    background: #1976d2;
    color: white;
    border-color: #1976d2;
  }

  .tab-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    padding: 24px;
  }
`;

export default Documents;