import AdvisorResourcesPage from './components/Advisor/Resources';
import AdvisorDocumentsPage from './components/Advisor/Documents';
import AdvisorMeetingsPage from './components/Advisor/Meetings/AdvisorMeetingsPage';
import AdvisorDocumentDetailPage from './components/Advisor/Documents/AdvisorDocumentDetailPage';
import AdvisorThesesPage from './components/Advisor/Theses';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import CompleteProfile from './components/Profile/CompleteProfile';
import Dashboard from './components/Dashboard/Dashboard';
import MyThesis from './components/Thesis/MyThesis';
import Documents from './components/Documents/Documents'; // ✅ CAMBIO: Import correcto
import MiAsesor from './components/Advisor/components/MiAsesor';
import StudentMeetingsPage from './components/Meetings/StudentMeetingsPage';
import RecursoGuia from './components/Progress/RecursoGuia';
import Notificaciones from './components/Notifications/Notificaciones';
import AdvisorDashboard from './components/Advisor/Dashboard';
import StudentsView from './components/Advisor/Students/StudentsView';
import StudentDetailPage from './components/Advisor/Students/StudentDetailPage';
import { layoutStyles } from './styles/layoutStyles';

function App() {
  return (
    <>
      <style>{layoutStyles}</style>
      <Router>
        <Routes>
        {/* 🔓 RUTA PÚBLICA (Solo Login) */}
        <Route path="/" element={<Login />} />

        {/* 🔄 RUTA SEMI-PROTEGIDA (Completar perfil) */}
        <Route path="/complete-profile" element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        } />

        {/* 🔒 RUTAS PROTEGIDAS (Requieren autenticación) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* 📖 NUEVA RUTA: Mi Tesis (inteligente - formulario o vista) */}
        <Route path="/mi-tesis" element={
          <ProtectedRoute>
            <MyThesis />
          </ProtectedRoute>
        } />
        
        {/* 📄 RUTA: Mis Documentos (Sistema completo con tabs) */}
        <Route path="/mis-documentos" element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        } />
        
        {/* 👨‍🏫 RUTA: Mi Asesor */}
        <Route path="/mi-asesor" element={
          <ProtectedRoute>
            <MiAsesor />
          </ProtectedRoute>
        } />
        {/* 📅 RUTA: Reuniones Estudiante */}
        <Route path="/mis-reuniones" element={
          <ProtectedRoute>
            <StudentMeetingsPage />
          </ProtectedRoute>
        } />
        
        {/* 📚 RUTA: Recursos y Guías */}
        <Route path="/recurso-guia" element={
          <ProtectedRoute>
            <RecursoGuia />
          </ProtectedRoute>
        } />
        
        {/* 🔔 RUTA: Notificaciones */}
        <Route path="/notificaciones" element={
          <ProtectedRoute>
            <Notificaciones />
          </ProtectedRoute>
        } />

        {/* 👨‍🏫 RUTA: Dashboard Asesor */}
        <Route path="/advisor/dashboard" element={
          <ProtectedRoute>
            <AdvisorDashboard />
          </ProtectedRoute>
        } />
        {/* 📖 RUTA: Tesis Asignadas para Asesor */}
        <Route path="/advisor/theses" element={
          <ProtectedRoute>
            <AdvisorThesesPage />
          </ProtectedRoute>
        } />
        {/* 📄 RUTA: Documentos Recibidos para Asesor */}
        <Route path="/advisor/documents" element={
          <ProtectedRoute>
            <AdvisorDocumentsPage />
          </ProtectedRoute>
        } />
        {/* 📄 RUTA: Detalle de Documento (Asesor) */}
        <Route path="/advisor/documents/:id" element={
          <ProtectedRoute>
            <AdvisorDocumentDetailPage />
          </ProtectedRoute>
        } />
        {/* 👨‍🎓 RUTA: Estudiantes Asignados para Asesor */}
        <Route path="/advisor/students" element={
          <ProtectedRoute>
            <StudentsView />
          </ProtectedRoute>
        } />
        {/* 👤 RUTA: Detalle de Estudiante (Asesor) */}
        <Route path="/advisor/students/:id" element={
          <ProtectedRoute>
            <StudentDetailPage />
          </ProtectedRoute>
        } />
        {/* 📚 RUTA: Recursos y Guías para Asesor */}
        <Route path="/advisor/resources" element={
          <ProtectedRoute>
            <AdvisorResourcesPage />
          </ProtectedRoute>
        } />
        {/* 📅 RUTA: Reuniones Asesor */}
        <Route path="/advisor/meetings" element={
          <ProtectedRoute>
            <AdvisorMeetingsPage />
          </ProtectedRoute>
        } />

        {/* 🚫 RUTA FALLBACK - Cualquier otra URL redirige al login */}
        <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;