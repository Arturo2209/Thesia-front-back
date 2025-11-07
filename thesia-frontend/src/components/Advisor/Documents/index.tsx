import React, { useState } from 'react';
import DocumentsHistory from './components/DocumentsHistory';
import StudentGroups from './components/StudentGroups';
import StudentPendingDetail from './components/StudentPendingDetail';
import Sidebar from '../Layout/Sidebar';
import { dashboardStyles } from '../styles/Dashboard.styles';

const AdvisorDocumentsPage = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedStudent, setSelectedStudent] = useState<{ studentId?: number; student: string } | null>(null);
  return (
    <div className="asesor-container">
      <Sidebar />
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h2 className="dashboard-title">Documentos</h2>
              <p className="dashboard-subtitle">
                Revisa, comenta, aprueba o rechaza los documentos enviados por tus estudiantes.
              </p>
            </div>
          </div>

          {/* Tabs navegación */}
          <div className="tabs-nav" style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
              style={tabButtonStyle(activeTab === 'pending')}
            >
              📥 Por revisar
            </button>
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
              style={tabButtonStyle(activeTab === 'history')}
            >
              🕒 Historial
            </button>
          </div>

          {activeTab === 'pending' ? (
            <section className="dashboard-section">
              {selectedStudent ? (
                <>
                  <h2 className="section-title">{`Pendientes de ${selectedStudent.student}`}</h2>
                  <StudentPendingDetail
                    studentId={selectedStudent.studentId}
                    student={selectedStudent.student}
                    onBack={() => setSelectedStudent(null)}
                  />
                </>
              ) : (
                <>
                  <h2 className="section-title">Estudiantes con pendientes</h2>
                  <StudentGroups onSelectStudent={(g) => setSelectedStudent(g)} />
                </>
              )}
            </section>
          ) : (
            <section className="dashboard-section">
              <h2 className="section-title">Historial de revisiones</h2>
              <DocumentsHistory />
            </section>
          )}
        </div>
      </div>
      <style>{dashboardStyles}</style>
      <style>{`
        .tab-button { 
          padding: 10px 16px; border-radius: 8px; border: 1px solid #e0e0e0; 
          background: #f5f5f5; cursor: pointer; font-weight: 500; 
        }
        .tab-button.active { background: #1976d2; border-color: #1976d2; color: #fff; }
      `}</style>
    </div>
  );
};

export default AdvisorDocumentsPage;

function tabButtonStyle(active: boolean): React.CSSProperties {
  return {
    background: active ? '#1976d2' : '#f5f5f5',
    color: active ? '#fff' : '#333',
    border: `1px solid ${active ? '#1976d2' : '#e0e0e0'}`,
    padding: '10px 16px',
    borderRadius: 8,
    cursor: 'pointer',
  };
}
