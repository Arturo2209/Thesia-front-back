import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import MiPerfil from './components/Profile/MiPerfil';
import CompleteProfile from './components/Profile/CompleteProfile';
import Dashboard from './components/Dashboard/Dashboard';
import MyThesis from './components/Thesis/MyThesis';
import MisDocumentos from './components/Documents/MisDocumentos';
import MiAsesor from './components/Advisor/MiAsesor';
import MiCalendario from './components/Calendar/MiCalendario';
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
        
        <Route path="/mi-perfil" element={
          <ProtectedRoute>
            <MiPerfil />
          </ProtectedRoute>
        } />
        
        {/* 📖 NUEVA RUTA: Mi Tesis (inteligente - formulario o vista) */}
        <Route path="/mi-tesis" element={
          <ProtectedRoute>
            <MyThesis />
          </ProtectedRoute>
        } />
        
        <Route path="/mis-documentos" element={
          <ProtectedRoute>
            <MisDocumentos />
          </ProtectedRoute>
        } />
        
        <Route path="/mi-asesor" element={
          <ProtectedRoute>
            <MiAsesor />
          </ProtectedRoute>
        } />
        
        <Route path="/mi-calendario" element={
          <ProtectedRoute>
            <MiCalendario />
          </ProtectedRoute>
        } />
        
        <Route path="/progreso" element={
          <ProtectedRoute>
            <ProgresoTesis />
          </ProtectedRoute>
        } />
        
        <Route path="/recurso-guia" element={
          <ProtectedRoute>
            <RecursoGuia />
          </ProtectedRoute>
        } />
        
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