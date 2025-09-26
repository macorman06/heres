import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Layout } from './components/layout/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Activities } from './pages/Activities';
import { Groups } from './pages/Groups';
import { Materials } from './pages/Materials';
import { Contact } from './pages/Contact';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// PrimeReact theme
import 'primereact/resources/themes/lara-light-blue/theme.css';  // tema PrimeReact
import 'primereact/resources/primereact.min.css';               // estilos PrimeReact base
import 'primeicons/primeicons.css';                             // iconos PrimeReact
import './styles/custom-prime-overrides.css';                   // tus sobrescrituras personalizadas
import './index.css';                                            // estilos globales (Tailwind)


const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Cargando aplicación..." />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <PrimeReactProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </PrimeReactProvider>
  );
}

export default App;