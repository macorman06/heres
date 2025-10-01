// src/App.tsx
import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Activities } from './pages/Activities';
import { Materials } from './pages/Materials';
import { Contact } from './pages/Contact';
import { AboutPage } from './pages/AboutPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// PrimeReact theme
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './styles/variables.css';
import './styles/fonts.css';
import './styles/typography.css';
import './styles/buttons.css';
import './styles/inputs.css';
import './styles/dropdowns.css';
import './styles/menus.css';
import './styles/cards-dialogs.css';
import './styles/login.css';
import './styles/construction.css';
import './styles/about.css';
import './styles/profile.css';
import './styles/toast.css'; // ✅ Nuevo import
import './index.css';

// Contexto para el Toast global
export const ToastContext = React.createContext<React.RefObject<Toast> | null>(null);

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<PrivateRoute element={<Layout />} />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/miembros" element={<Members />} />
      <Route path="/actividades" element={<Activities />} />
      <Route path="/materiales" element={<Materials />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  const toastRef = useRef<Toast>(null);

  return (
    <PrimeReactProvider>
      <ToastContext.Provider value={toastRef}>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <Toast ref={toastRef} position="bottom-right" />
              <AppRoutes />
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </ToastContext.Provider>
    </PrimeReactProvider>
  );
}

export default App;
