import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { Toast } from 'primereact/toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { Layout } from './components/layout/Layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import * as Pages from './pages';

// EXTERNAL LIBRARIES
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// 1. BASE
import './styles/1-base/variables.css';
import './styles/1-base/fonts.css';

// 2. CORE
import './styles/2-core/typography.css';

// 3. COMPONENTS
import './styles/3-components/buttons.css';
import './styles/3-components/forms.css';
import './styles/3-components/cards.css';
import './styles/3-components/dialogs.css';
import './styles/3-components/menus.css';
import './styles/3-components/toast.css';
import './styles/3-components/badge.css';
import './styles/3-components/avatar.css';

// 4. PAGES
import './styles/4-pages/login.css';
import './styles/4-pages/profile.css';
import './styles/4-pages/grupos.css';
import './styles/4-pages/privacy-policy.css';
import './styles/4-pages/qr-register.css';
import './styles/4-pages/about.css';
import './styles/4-pages/members.css';

// 5. OVERRIDES
import './styles/5-overrides/primereact-overrides.css';

// INDEX
import './index.css';

// Contexto para el Toast global
export const ToastContext = React.createContext<React.RefObject<Toast> | null>(null);

const PrivateRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  return isAuthenticated ? element : <Navigate to="/login" />;
};

// Lista de rutas públicas que NO requieren autenticación
const PUBLIC_ROUTES = ['/login', '/qr/register-member', '/activate', '/privacy-policy'];

const AuthWatcher: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
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
    <PrimeReactProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastContext.Provider value={toastRef}>
            <Router>
              <AuthWatcher />
              <Toast ref={toastRef} />
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Pages.LoginPage />} />
                <Route path="/qr/register-member" element={<Pages.QRRegisterMember />} />
                <Route path="/privacy-policy" element={<Pages.PrivacyPolicy />} />
                <Route path="/activate/:token" element={<Pages.ActivateAccount />} />

                {/* Rutas protegidas con Layout */}
                <Route element={<PrivateRoute element={<Layout />} />}>
                  <Route path="/" element={<Pages.Dashboard />} />
                  <Route path="/dashboard" element={<Pages.Dashboard />} />
                  <Route path="/members" element={<Pages.Members />} />
                  <Route path="/activities" element={<Pages.Activities />} />
                  <Route path="/contact" element={<Pages.Contact />} />
                  <Route path="/about" element={<Pages.AboutPage />} />
                  <Route path="/profile" element={<Pages.ProfilePage />} />
                  <Route path="/grupos" element={<Pages.Grupos />} />
                  <Route path="/ranking" element={<Pages.Ranking />} />

                  {/* Materiales */}
                  <Route path="/materiales" element={<Pages.Materials />} />
                  <Route
                    path="/materiales/grupos-formativos"
                    element={<Pages.GruposFormativosIndex />}
                  />

                  {/* Grupos Formativos */}
                  <Route
                    path="/materiales/grupos-formativos/chiqui"
                    element={<Pages.ChiquiPage />}
                  />
                  <Route
                    path="/materiales/grupos-formativos/centro-juvenil"
                    element={<Pages.CentroJuvenilPage />}
                  />
                  <Route
                    path="/materiales/grupos-formativos/catecumenado"
                    element={<Pages.CatecumenadoPage />}
                  />
                  <Route
                    path="/materiales/grupos-formativos/salesianos-cooperadores"
                    element={<Pages.SalesianosCoperadoresPage />}
                  />
                  <Route
                    path="/materiales/grupos-formativos/comunidades"
                    element={<Pages.ComunidadesPage />}
                  />
                  <Route
                    path="/materiales/grupos-formativos/otros"
                    element={<Pages.OtrosGruposPage />}
                  />

                  {/* Talleres */}
                  <Route path="/materiales/talleres" element={<Pages.TalleresIndex />} />
                  <Route
                    path="/materiales/talleres/manualidades"
                    element={<Pages.ManualidadesPage />}
                  />
                  <Route path="/materiales/talleres/cocina" element={<Pages.CocinaPage />} />
                  <Route path="/materiales/talleres/otros" element={<Pages.OtrosTalleresPage />} />

                  {/* Juegos */}
                  <Route path="/materiales/juegos" element={<Pages.JuegosIndex />} />
                  <Route path="/materiales/juegos/cluedo" element={<Pages.CluedoPage />} />
                  <Route path="/materiales/juegos/tablero" element={<Pages.TableroPage />} />
                  <Route path="/materiales/juegos/gymkana" element={<Pages.GymkanaPage />} />
                  <Route path="/materiales/juegos/otros" element={<Pages.OtrosJuegosPage />} />

                  {/* Pruebas */}
                  <Route path="/materiales/pruebas" element={<Pages.PruebasIndex />} />
                  <Route path="/materiales/pruebas/interior" element={<Pages.InteriorPage />} />
                  <Route path="/materiales/pruebas/exterior" element={<Pages.ExteriorPage />} />

                  {/* Oraciones */}
                  <Route path="/materiales/oraciones" element={<Pages.OracionesIndex />} />
                  <Route path="/materiales/oraciones/ninos" element={<Pages.NinosPage />} />
                  <Route
                    path="/materiales/oraciones/jovenes"
                    element={<Pages.JovenesOracionesPage />}
                  />
                  <Route path="/materiales/oraciones/adultos" element={<Pages.AdultosPage />} />

                  {/* Campaña Pastoral */}
                  <Route
                    path="/materiales/campana-pastoral"
                    element={<Pages.CampanaPastoralIndex />}
                  />
                  <Route
                    path="/materiales/campana-pastoral/justificacion"
                    element={<Pages.JustificacionPage />}
                  />
                  <Route
                    path="/materiales/campana-pastoral/imagen"
                    element={<Pages.ImagenPage />}
                  />
                  <Route
                    path="/materiales/campana-pastoral/materiales"
                    element={<Pages.MaterialesCampanaPage />}
                  />

                  {/* Imagen Corporativa */}
                  <Route
                    path="/materiales/imagen-corporativa"
                    element={<Pages.ImagenCorporativaIndex />}
                  />
                  <Route
                    path="/materiales/imagen-corporativa/logos"
                    element={<Pages.LogosPage />}
                  />
                  <Route
                    path="/materiales/imagen-corporativa/tipografia"
                    element={<Pages.TipografiaPage />}
                  />
                  <Route
                    path="/materiales/imagen-corporativa/otros"
                    element={<Pages.OtrosImagenPage />}
                  />
                </Route>

                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Router>
          </ToastContext.Provider>
        </AuthProvider>
      </ThemeProvider>
    </PrimeReactProvider>
  );
}

export default App;
