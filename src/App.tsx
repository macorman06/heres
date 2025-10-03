import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { Layout } from './components/layout/Layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';

import {
  // Páginas principales
  Dashboard,
  LoginPage,
  Members,
  Activities,
  Contact,
  AboutPage,
  ProfilePage,
  Grupos,
  QRRegisterMember,
  PrivacyPolicy,

  // Materiales principal
  Materials,

  // Grupos Formativos
  GruposFormativosIndex,
  ChiquiPage,
  CentroJuvenilPage,
  CatecumenadoPage,
  SalesianosCoperadoresPage,
  ComunidadesPage,
  OtrosGruposPage,

  // Talleres
  TalleresIndex,
  ManualidadesPage,
  CocinaPage,
  OtrosTalleresPage,

  // Juegos
  JuegosIndex,
  CluedoPage,
  TableroPage,
  GymkanaPage,
  OtrosJuegosPage,

  // Pruebas
  PruebasIndex,
  InteriorPage,
  ExteriorPage,

  // Oraciones
  OracionesIndex,
  NinosPage,
  JovenesOracionesPage,
  AdultosPage,

  // Campaña Pastoral
  CampanaPastoralIndex,
  JustificacionPage,
  ImagenPage,
  MaterialesCampanaPage,

  // Imagen Corporativa
  ImagenCorporativaIndex,
  LogosPage,
  TipografiaPage,
  OtrosImagenPage,
} from './pages';

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
import './styles/toast.css';
import './styles/grupos.css';
import './index.css';

// Contexto para el Toast global
export const ToastContext = React.createContext<React.RefObject<Toast> | null>(null);

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// Lista de rutas públicas que NO requieren autenticación
const PUBLIC_ROUTES = ['/login', '/qr/register-member', '/privacy-policy'];

const AuthWatcher: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    // Solo redirigir si no está autenticado Y no está en una ruta pública
    const isPublicRoute = PUBLIC_ROUTES.some((route) => location.pathname.startsWith(route));

    if (!isAuthenticated && !isPublicRoute) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, location]);

  return null;
};

function App() {
  const toastRef = useRef<Toast>(null);

  return (
    <ThemeProvider>
      <AuthProvider>
        <PrimeReactProvider>
          <Router>
            <ToastContext.Provider value={toastRef}>
              <Toast ref={toastRef} />
              <AuthWatcher />
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/qr/register-member" element={<QRRegisterMember />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                {/* Rutas protegidas */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <Dashboard />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/members"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <Members />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/activities"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <Activities />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <Contact />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/about"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <AboutPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <ProfilePage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/grupos"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <Grupos />
                        </Layout>
                      }
                    />
                  }
                />

                {/* Materiales */}
                <Route
                  path="/materials"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <Materials />
                        </Layout>
                      }
                    />
                  }
                />

                {/* Grupos Formativos */}
                <Route
                  path="/materials/grupos-formativos"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <GruposFormativosIndex />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/grupos-formativos/chiqui"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <ChiquiPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/grupos-formativos/centro-juvenil"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <CentroJuvenilPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/grupos-formativos/catecumenado"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <CatecumenadoPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/grupos-formativos/salesianos-cooperadores"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <SalesianosCoperadoresPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/grupos-formativos/comunidades"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <ComunidadesPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/grupos-formativos/otros"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <OtrosGruposPage />
                        </Layout>
                      }
                    />
                  }
                />

                {/* Talleres */}
                <Route
                  path="/materials/talleres"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <TalleresIndex />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/talleres/manualidades"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <ManualidadesPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/talleres/cocina"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <CocinaPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/talleres/otros"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <OtrosTalleresPage />
                        </Layout>
                      }
                    />
                  }
                />

                {/* Juegos */}
                <Route
                  path="/materials/juegos"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <JuegosIndex />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/juegos/cluedo"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <CluedoPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/juegos/tablero"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <TableroPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/juegos/gymkana"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <GymkanaPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/juegos/otros"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <OtrosJuegosPage />
                        </Layout>
                      }
                    />
                  }
                />

                {/* Pruebas */}
                <Route
                  path="/materials/pruebas"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <PruebasIndex />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/pruebas/interior"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <InteriorPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/pruebas/exterior"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <ExteriorPage />
                        </Layout>
                      }
                    />
                  }
                />

                {/* Oraciones */}
                <Route
                  path="/materials/oraciones"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <OracionesIndex />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/oraciones/ninos"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <NinosPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/oraciones/jovenes"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <JovenesOracionesPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/oraciones/adultos"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <AdultosPage />
                        </Layout>
                      }
                    />
                  }
                />

                {/* Campaña Pastoral */}
                <Route
                  path="/materials/campana-pastoral"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <CampanaPastoralIndex />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/campana-pastoral/justificacion"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <JustificacionPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/campana-pastoral/imagen"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <ImagenPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/campana-pastoral/materiales"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <MaterialesCampanaPage />
                        </Layout>
                      }
                    />
                  }
                />

                {/* Imagen Corporativa */}
                <Route
                  path="/materials/imagen-corporativa"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <ImagenCorporativaIndex />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/imagen-corporativa/logos"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <LogosPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/imagen-corporativa/tipografia"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <TipografiaPage />
                        </Layout>
                      }
                    />
                  }
                />
                <Route
                  path="/materials/imagen-corporativa/otros"
                  element={
                    <PrivateRoute
                      element={
                        <Layout>
                          <OtrosImagenPage />
                        </Layout>
                      }
                    />
                  }
                />

                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ToastContext.Provider>
          </Router>
        </PrimeReactProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
