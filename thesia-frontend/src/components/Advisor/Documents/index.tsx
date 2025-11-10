import { useState, useEffect } from 'react';
import DocumentsHistory from './components/DocumentsHistory';
import StudentGroups from './components/StudentGroups';
import StudentPendingDetail from './components/StudentPendingDetail';
import Sidebar from '../Layout/Sidebar';
import { documentsStyles } from '../../Documents/styles/Documents.styles';

const AdvisorDocumentsPage = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedStudent, setSelectedStudent] = useState<{ studentId?: number; student: string } | null>(null);

  // Restaurar selección si venimos del detalle
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('advisor.selectedStudent');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.studentId || parsed.student)) {
          setSelectedStudent({ studentId: parsed.studentId, student: parsed.student });
        }
        sessionStorage.removeItem('advisor.selectedStudent');
      }
    } catch {}
  }, []);
  return (
    <div className="documents-container">
      <style>{documentsStyles}</style>
      <Sidebar />
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>

        <div className="content-section">
          <div className="tabs-container">
            <div className="tabs-bar">
              {activeTab === 'pending' && selectedStudent && (
                <button
                  className="action-button secondary back-inline"
                  onClick={() => setSelectedStudent(null)}
                >
                  ← Volver
                </button>
              )}
              <div className="tabs-nav">
                <button
                  className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pending')}
                >
                  📥 Por revisar
                </button>
                <button
                  className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  🕒 Historial
                </button>
              </div>
            </div>
            <div className="tab-content">
              {activeTab === 'pending'
                ? (selectedStudent
      ? (<StudentPendingDetail
                        studentId={selectedStudent.studentId}
                        student={selectedStudent.student}
        onBack={() => setSelectedStudent(null)}
        hideBackButton
                    />)
                  : (<StudentGroups onSelectStudent={(g) => setSelectedStudent(g)} />))
                : (<DocumentsHistory />)}
            </div>
          </div>
        </div>
      <style>{`
      .tabs-bar { display:flex; align-items:center; justify-content:center; gap:24px; margin-bottom:8px; position:relative; }
      .tabs-bar .tabs-nav { display:flex; gap:12px; }
      .tabs-bar .back-inline { position:absolute; left:0; top:0; transform:translateY(0); margin:0; }
      .tabs-bar .back-inline { padding:10px 16px; }
      @media (max-width:768px){
        .tabs-bar { flex-wrap:wrap; justify-content:center; }
        .tabs-bar .back-inline { position:static; order:1; width:100%; justify-content:center; text-align:center; }
        .tabs-bar .tabs-nav { order:2; width:100%; justify-content:center; }
      }
    `}</style>
      </div>
    </div>
  );
};

export default AdvisorDocumentsPage;
