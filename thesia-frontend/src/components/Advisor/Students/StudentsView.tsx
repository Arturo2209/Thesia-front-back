import React from 'react';
import Sidebar from '../Layout/Sidebar';
import StudentsList from './components/StudentsList';
import './StudentsView.styles.css';

const StudentsView: React.FC = () => {
  return (
    <div className="advisor-container">
      <Sidebar />
      <div className="main-content">
        <header className="main-header">
          <h1>Sistema de Tesis y Pretesis</h1>
          <div className="notification-icon">🔔</div>
        </header>
        <section className="students-section">
          <div className="students-list-container">
            <StudentsList />
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentsView;