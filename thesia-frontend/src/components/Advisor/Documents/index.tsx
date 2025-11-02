import DocumentsList from './components/DocumentsList';
import Sidebar from '../Layout/Sidebar';
console.log('[AdvisorDocumentsPage] Renderizando Sidebar exclusivo del asesor');

const AdvisorDocumentsPage = () => {
  return (
    <div className="advisor-documents-container">
      <Sidebar />
      <main className="advisor-main-content">
        <DocumentsList />
      </main>
      <style>{`
        .advisor-documents-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background-color: #f5f5f5;
          overflow-x: hidden;
        }
        .advisor-main-content {
          flex: 1;
          margin-left: 280px;
          width: calc(100% - 280px);
          padding: 2rem;
          min-height: 100vh;
          overflow-x: hidden;
        }
        @media (max-width: 768px) {
          .advisor-main-content {
            margin-left: 0;
            width: 100%;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdvisorDocumentsPage;
