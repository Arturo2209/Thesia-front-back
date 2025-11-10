import React from 'react';
import Sidebar from '../Layout/Sidebar';
import StudentsList from './components/StudentsList';
import { documentsStyles } from '../../Documents/styles/Documents.styles';

const StudentsView: React.FC = () => {
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
          <StudentsList />
        </div>
      </div>
    </div>
  );
};

export default StudentsView;