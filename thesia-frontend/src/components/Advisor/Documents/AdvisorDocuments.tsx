import React, { useEffect, useState } from 'react';
import advisorService from '../../../services/advisorService';
import './AdvisorDocuments.styles.css';

interface Document {
  id: number;
  title: string;
  studentName: string;
  submissionDate: string;
  status: string;
}

const AdvisorDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const data = await advisorService.getPendingDocuments();

        // Validar que la respuesta sea un arreglo
        if (Array.isArray(data)) {
          const mappedData = data.map((doc) => ({
            id: doc.id,
            title: doc.title,
            studentName: doc.student,
            submissionDate: doc.submittedAt,
            status: doc.status,
          }));
          setDocuments(mappedData);
        } else {
          console.error('La respuesta no es un arreglo:', data);
          setError('Error al cargar los documentos. Respuesta inesperada.');
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleApprove = async (documentId: number) => {
    try {
      await advisorService.approveDocument(documentId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (err) {
      console.error('Error approving document:', err);
      setError('Failed to approve the document.');
    }
  };

  const handleReject = async (documentId: number) => {
    try {
      await advisorService.rejectDocument(documentId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (err) {
      console.error('Error rejecting document:', err);
      setError('Failed to reject the document.');
    }
  };

  if (loading) {
    return <div>Loading documents...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="advisor-documents-container">
      <h2>Documentos Enviados</h2>
      {documents.length === 0 ? (
        <p>No hay documentos pendientes.</p>
      ) : (
        <ul className="documents-list">
          {documents.map((doc) => (
            <li key={doc.id} className="document-item">
              <div className="document-info">
                <h3>{doc.title}</h3>
                <p>Estudiante: {doc.studentName}</p>
                <p>Fecha de envío: {doc.submissionDate}</p>
                <p>Estado: {doc.status}</p>
              </div>
              <div className="document-actions">
                <button onClick={() => handleApprove(doc.id)}>Aprobar</button>
                <button onClick={() => handleReject(doc.id)}>Rechazar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdvisorDocuments;