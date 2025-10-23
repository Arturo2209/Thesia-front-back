import ThesesList from './components/ThesesList';
import Sidebar from '../Layout/Sidebar';
console.log('[AdvisorThesesPage] Renderizando Sidebar exclusivo del asesor');

const AdvisorThesesPage = () => {
  return (
    <div>
      <Sidebar />
      <main className="advisor-main-content">
        <ThesesList />
      </main>
    </div>
  );
};

export default AdvisorThesesPage;
