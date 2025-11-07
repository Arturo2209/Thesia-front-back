import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import MyDocuments from './components/MyDocuments';
import UploadDocument from './components/UploadDocument';
import DocumentDetail from './components/DocumentDetail';
import DocumentHistory from './components/DocumentHistory';
import authService from '../../services/authService';
import { documentsStyles } from './styles/Documents.styles';

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'my-documents' | 'upload' | 'history'>('my-documents');
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const tab = searchParams.get('tab') as 'my-documents' | 'upload' | 'history';
    if (tab && ['my-documents', 'upload', 'history'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'my-documents' | 'upload' | 'history') => {
    setActiveTab(tab);
    setSelectedDocumentId(null);
    setSearchParams({ tab });
  };

  const handleViewDocument = (documentId: number) => {
    setSelectedDocumentId(documentId);
  };

  const handleBackToList = () => {
    setSelectedDocumentId(null);
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

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
      </div>
    );
  }

  return (
    <div className="documents-container">
      <style>{documentsStyles}</style>
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>
        <div className="content-section">
          <div className="tabs-container">
            <div className="tabs-nav">
              <button
                className={`tab-button ${activeTab === 'my-documents' ? 'active' : ''}`}
                onClick={() => handleTabChange('my-documents')}
              >
                📄 Mis Documentos
              </button>
              <button
                className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => handleTabChange('upload')}
              >
                ⬆️ Subir Documento
              </button>
              <button
                className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => handleTabChange('history')}
              >
                🕒 Historial
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
    </div>
  );
};

export default Documents;