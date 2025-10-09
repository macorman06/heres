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
  Ranking,
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
  return isAuthenticated ? element : <Navigate to="/login" />;
};

// Lista de rutas públicas que NO requieren autenticación
const PUBLIC_ROUTES = ['/login', '/qr/register-member', '/privacy-policy'];

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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/qr/register-member" element={<QRRegisterMember />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                {/* Rutas protegidas con Layout */}
                <Route element={<PrivateRoute element={<Layout />} />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/grupos" element={<Grupos />} />
                  <Route path="/ranking" element={<Ranking />} />

                  {/* Materiales */}
                  <Route path="/materiales" element={<Materials />} />
                  <Route path="/materiales/grupos-formativos" element={<GruposFormativosIndex />} />

                  {/* Grupos Formativos */}
                  <Route path="/materiales/grupos-formativos/chiqui" element={<ChiquiPage />} />
                  <Route
                    path="/materiales/grupos-formativos/centro-juvenil"
                    element={<CentroJuvenilPage />}
                  />
                  <Route
                    path="/materiales/grupos-formativos/catecumenado"
                    element={<CatecumenadoPage />}
                  />
                  <Route
                    path="/materiales/grupos-formativos/salesianos-cooperadores"
                    element={<SalesianosCoperadoresPage />}
                  />
                  <Route
                    path="/materiales/grupos-formativos/comunidades"
                    element={<ComunidadesPage />}
                  />
                  <Route path="/materiales/grupos-formativos/otros" element={<OtrosGruposPage />} />

                  {/* Talleres */}
                  <Route path="/materiales/talleres" element={<TalleresIndex />} />
                  <Route path="/materiales/talleres/manualidades" element={<ManualidadesPage />} />
                  <Route path="/materiales/talleres/cocina" element={<CocinaPage />} />
                  <Route path="/materiales/talleres/otros" element={<OtrosTalleresPage />} />

                  {/* Juegos */}
                  <Route path="/materiales/juegos" element={<JuegosIndex />} />
                  <Route path="/materiales/juegos/cluedo" element={<CluedoPage />} />
                  <Route path="/materiales/juegos/tablero" element={<TableroPage />} />
                  <Route path="/materiales/juegos/gymkana" element={<GymkanaPage />} />
                  <Route path="/materiales/juegos/otros" element={<OtrosJuegosPage />} />

                  {/* Pruebas */}
                  <Route path="/materiales/pruebas" element={<PruebasIndex />} />
                  <Route path="/materiales/pruebas/interior" element={<InteriorPage />} />
                  <Route path="/materiales/pruebas/exterior" element={<ExteriorPage />} />

                  {/* Oraciones */}
                  <Route path="/materiales/oraciones" element={<OracionesIndex />} />
                  <Route path="/materiales/oraciones/ninos" element={<NinosPage />} />
                  <Route path="/materiales/oraciones/jovenes" element={<JovenesOracionesPage />} />
                  <Route path="/materiales/oraciones/adultos" element={<AdultosPage />} />

                  {/* Campaña Pastoral */}
                  <Route path="/materiales/campana-pastoral" element={<CampanaPastoralIndex />} />
                  <Route
                    path="/materiales/campana-pastoral/justificacion"
                    element={<JustificacionPage />}
                  />
                  <Route path="/materiales/campana-pastoral/imagen" element={<ImagenPage />} />
                  <Route
                    path="/materiales/campana-pastoral/materiales"
                    element={<MaterialesCampanaPage />}
                  />

                  {/* Imagen Corporativa */}
                  <Route
                    path="/materiales/imagen-corporativa"
                    element={<ImagenCorporativaIndex />}
                  />
                  <Route path="/materiales/imagen-corporativa/logos" element={<LogosPage />} />
                  <Route
                    path="/materiales/imagen-corporativa/tipografia"
                    element={<TipografiaPage />}
                  />
                  <Route
                    path="/materiales/imagen-corporativa/otros"
                    element={<OtrosImagenPage />}
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
