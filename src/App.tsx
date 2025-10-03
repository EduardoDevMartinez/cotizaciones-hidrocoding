import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CotizacionesProvider } from './context/CotizacionesContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CotizacionesList from './pages/CotizacionesList';
import NuevaCotizacion from './pages/NuevaCotizacion';
import DetalleCotizacion from './pages/DetalleCotizacion';
import CotizacionPublica from './pages/CotizacionPublica';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CotizacionesProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cotizacion/publica/:token" element={<CotizacionPublica />} />

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="cotizaciones" element={<CotizacionesList />} />
              <Route path="nueva-cotizacion" element={<NuevaCotizacion />} />
              <Route path="cotizacion/:id" element={<DetalleCotizacion />} />
              <Route path="editar/:id" element={<NuevaCotizacion />} />
            </Route>
          </Routes>
        </CotizacionesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
