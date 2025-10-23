import DocumentsList from './components/DocumentsList';
import Sidebar from '../Layout/Sidebar';
console.log('[AdvisorDocumentsPage] Renderizando Sidebar exclusivo del asesor');

const AdvisorDocumentsPage = () => {
  return (
    <div>
      <Sidebar />
      <main className="advisor-main-content">
        <DocumentsList />
      </main>
    </div>
  );
};

export default AdvisorDocumentsPage;
