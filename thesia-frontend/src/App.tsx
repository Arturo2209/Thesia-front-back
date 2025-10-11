import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import CompleteProfile from './components/Profile/CompleteProfile';
import Dashboard from './components/Dashboard/Dashboard';
import MyThesis from './components/Thesis/MyThesis';
import Documents from './components/Documents/Documents'; // ✅ CAMBIO: Import correcto
import MiAsesor from './components/Advisor/MiAsesor';
import ProgresoTesis from './components/Progress/ProgresoTesis';
import RecursoGuia from './components/Progress/RecursoGuia';
import Notificaciones from './components/Notifications/Notificaciones';

function App() {
  return (
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
        
        {/* 📊 RUTA: Progreso de Tesis */}
        <Route path="/progreso" element={
          <ProtectedRoute>
            <ProgresoTesis />
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

        {/* 🚫 RUTA FALLBACK - Cualquier otra URL redirige al login */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;