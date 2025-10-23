import ResourcesList from './components/ResourcesList';
import Sidebar from '../Layout/Sidebar';
console.log('[AdvisorResourcesPage] Renderizando Sidebar exclusivo del asesor');

const AdvisorResourcesPage = () => {
  return (
    <div>
      <Sidebar />
      <main className="advisor-main-content">
        <ResourcesList />
      </main>
    </div>
  );
};

export default AdvisorResourcesPage;
