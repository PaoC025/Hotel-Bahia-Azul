import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Servicios from './pages/Servicios';
import Habitaciones from './pages/Habitaciones';
import Blog from './pages/Blog';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Register from './pages/Register';
import HabitacionDetalle from './pages/HabitacionDetalle';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import PromotionBanner from './components/PromotionBanner';
import CssBaseline from '@mui/material/CssBaseline';

// 🧱 Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import HabitacionesAdmin from './pages/admin/HabitacionesAdmin';
import BlogsAdmin from './pages/admin/BlogsAdmin';
import TestimoniosAdmin from './pages/admin/TestimoniosAdmin';
import UsuariosAdmin from './pages/admin/UsuariosAdmin';

function AnimatedRoutes() {
  const location = useLocation();

  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: 'easeIn' } },
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 🏠 RUTAS PÚBLICAS */}
        <Route
          path="/"
          element={
            <motion.div {...pageTransition}>
              <PromotionBanner />
              <Landing />
            </motion.div>
          }
        />
        <Route
          path="/servicios"
          element={
            <motion.div {...pageTransition}>
              <PromotionBanner />
              <Servicios />
            </motion.div>
          }
        />
        <Route
          path="/habitaciones"
          element={
            <motion.div {...pageTransition}>
              <PromotionBanner />
              <Habitaciones />
            </motion.div>
          }
        />
        <Route
          path="/habitacion/:id"
          element={
            <motion.div {...pageTransition}>
              <HabitacionDetalle />
            </motion.div>
          }
        />
        <Route
          path="/blog"
          element={
            <motion.div {...pageTransition}>
              <PromotionBanner />
              <Blog />
            </motion.div>
          }
        />
        <Route
          path="/contacto"
          element={
            <motion.div {...pageTransition}>
              <Contacto />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div {...pageTransition}>
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div {...pageTransition}>
              <Register />
            </motion.div>
          }
        />

        {/* ⚙️ RUTAS ADMINISTRADOR */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <motion.div {...pageTransition}>
                <AdminDashboard />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/habitaciones"
          element={
            <ProtectedRoute requireAdmin>
              <motion.div {...pageTransition}>
                <HabitacionesAdmin />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <ProtectedRoute requireAdmin>
              <motion.div {...pageTransition}>
                <BlogsAdmin />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/testimonios"
          element={
            <ProtectedRoute requireAdmin>
              <motion.div {...pageTransition}>
                <TestimoniosAdmin />
              </motion.div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute requireAdmin>
              <motion.div {...pageTransition}>
                <UsuariosAdmin />
              </motion.div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <CustomThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <AppProvider>
          {isAdminRoute ? (
            <AnimatedRoutes />
          ) : (
            <Layout>
              <AnimatedRoutes />
            </Layout>
          )}
        </AppProvider>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;

