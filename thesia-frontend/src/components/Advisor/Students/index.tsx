import StudentsList from './components/StudentsList';
import Sidebar from '../Layout/Sidebar';
console.log('[AdvisorStudentsPage] Renderizando Sidebar exclusivo del asesor');

const AdvisorStudentsPage = () => {
  return (
    <div>
      <Sidebar />
      <main className="advisor-main-content">
        <StudentsList />
      </main>
    </div>
  );
};

export default AdvisorStudentsPage;
