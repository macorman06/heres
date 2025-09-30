// src/App.tsx (ASEGÚRATE DE USAR ESTA VERSIÓN)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Activities } from './pages/Activities';
import { Materials } from './pages/Materials';
import { Contact } from './pages/Contact';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// PrimeReact theme
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import './styles/variables.css';
import './styles/fonts.css';
import './styles/typography.css';    // 3. Tipografía tercero
import './styles/buttons.css';       // 4. Componentes después
import './styles/inputs.css';
import './styles/dropdowns.css';
import './styles/cards-dialogs.css';
import './index.css';

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner message="Verificando..." />;

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<PrivateRoute element={<Layout />} />}>
      <Route index element={<Dashboard />} />
      <Route path="miembros" element={<Members />} />
      <Route path="actividades" element={<Activities />} />
      <Route path="materiales" element={<Materials />} />
      <Route path="contacto" element={<Contact />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <PrimeReactProvider>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </PrimeReactProvider>
  );
}

export default App;
