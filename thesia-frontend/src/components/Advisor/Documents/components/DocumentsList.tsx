import React from 'react';
import type { AdvisorDocument } from '../types/document.types';
import '../styles/DocumentsList.styles.css';

const documents: AdvisorDocument[] = [
  { id: 101, title: 'Informe de avance', student: 'Carlos Arturo', status: 'Pendiente', submittedAt: '2025-10-01' },
  { id: 102, title: 'Capítulo 1', student: 'Kenny', status: 'Revisado', submittedAt: '2025-10-10' },
];

const DocumentsList: React.FC = () => {
  return (
    <div className="documents-list-container">
      <h2>Documentos Recibidos</h2>
      <ul className="documents-list">
        {documents.map(doc => (
          <li key={doc.id} className="document-item">
            <div className="document-title">{doc.title}</div>
            <div className="document-details">
              <span>Estudiante: {doc.student}</span>
              <span>Estado: {doc.status}</span>
              <span>Fecha envío: {doc.submittedAt}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentsList;
