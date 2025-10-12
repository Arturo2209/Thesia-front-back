import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import MyDocuments from './components/MyDocuments';
import UploadDocument from './components/UploadDocument';
import DocumentDetail from './components/DocumentDetail';
import DocumentHistory from './components/DocumentHistory'; // ✅ NUEVO IMPORT
import authService from '../../services/authService';
import { documentsStyles } from './styles/Documents.styles';

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
    <div className="documents-container">
      <Sidebar onLogout={handleLogout} />
      
      <div className="main-content">
        {/* HEADER */}
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="content-section">
          {/* TABS NAVIGATION */}
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
          </div>

          {/* CONTENT AREA */}
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
                  handleTabChange('my-documents'); // Ir a lista después de subir
                }}
              />
            )}
            
            {/* ✅ NUEVO: USAR DOCUMENTHISTORY EN LUGAR DE MYDOCUMENTS */}
            {activeTab === 'history' && (
              <DocumentHistory 
                onViewDocument={handleViewDocument}
                refreshTrigger={refreshTrigger}
              />
            )}
          </div>
        </div>
      </div>

      <style>{documentsStyles}</style>
    </div>
  );
};

export default Documents;