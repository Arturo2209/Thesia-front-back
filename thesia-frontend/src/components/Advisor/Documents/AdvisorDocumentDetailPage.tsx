import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import AdvisorDocumentDetail from './components/AdvisorDocumentDetail';
import { documentsStyles } from '../../Documents/styles/Documents.styles';

const AdvisorDocumentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const id = Number(params.id);

  const handleBack = () => {
    // Si venimos desde la lista de un estudiante, preservamos su contexto
    const studentId = searchParams.get('studentId');
    const student = searchParams.get('student');
    if (studentId || student) {
      navigate(`/advisor/documents?tab=pending`, { replace: true });
      // En la vista de documentos, usaremos un pequeño estado para volver a seleccionar al estudiante
      // pasando por sessionStorage para no complicar rutas
      try {
        sessionStorage.setItem('advisor.selectedStudent', JSON.stringify({
          studentId: studentId ? Number(studentId) : undefined,
          student: student || ''
        }));
      } catch {}
      return;
    }
    // Fallback: ir a la lista general
    navigate('/advisor/documents');
  };

  if (!id || Number.isNaN(id)) {
    return (
      <div className="documents-container">
        <style>{documentsStyles}</style>
        <Sidebar />
        <div className="main-content" style={{ padding: 24 }}>
          <h2>Documento no válido</h2>
          <button className="action-button" onClick={handleBack}>Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="documents-container">
      <style>{documentsStyles}</style>
      <Sidebar />
      <div className="main-content">
        <AdvisorDocumentDetail
          documentId={id}
          onBack={handleBack}
          onApproved={handleBack}
          onRejected={handleBack}
        />
      </div>
    </div>
  );
};

export default AdvisorDocumentDetailPage;
