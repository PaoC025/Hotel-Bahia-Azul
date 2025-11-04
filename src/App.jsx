import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Servicios from './pages/Servicios'
import Habitaciones from './pages/Habitaciones'
import Blog from './pages/Blog'
import Contacto from './pages/Contacto'
import Login from './pages/Login'
import Register from './pages/Register'
import HabitacionDetalle from './pages/HabitacionDetalle'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider } from './context/AppContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import PromotionBanner from './components/PromotionBanner'
import CssBaseline from '@mui/material/CssBaseline'

function AnimatedRoutes() {
  const location = useLocation()

  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' }},
    exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: 'easeIn' }},
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div {...pageTransition}>
            <PromotionBanner />
            <Landing />
          </motion.div>
        } />
        <Route path="/servicios" element={
          <motion.div {...pageTransition}>
            <PromotionBanner />
            <Servicios />
          </motion.div>
        } />
        <Route path="/habitaciones" element={
          <motion.div {...pageTransition}>
            <PromotionBanner />
            <Habitaciones />
          </motion.div>
        } />
        <Route path="/habitacion/:id" element={
          <motion.div {...pageTransition}>
            <HabitacionDetalle />
          </motion.div>
        } />
        <Route path="/blog" element={
          <motion.div {...pageTransition}>
            <PromotionBanner />
            <Blog />
          </motion.div>
        } />
        <Route path="/contacto" element={
          <motion.div {...pageTransition}><Contacto /></motion.div>
        } />
        <Route path="/reservas" element={
          <motion.div {...pageTransition}><Contacto /></motion.div>
        } />
        <Route path="/login" element={
          <motion.div {...pageTransition}><Login /></motion.div>
        } />
        <Route path="/register" element={
          <motion.div {...pageTransition}><Register /></motion.div>
        } />
        <Route path="/admin/*" element={
          <motion.div {...pageTransition}>
            <ProtectedRoute requireAdmin>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Panel de Administración</h1>
                <p>Esta sección estará disponible próximamente</p>
                <p>🔧 En desarrollo por el Integrante 3</p>
              </div>
            </ProtectedRoute>
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    // ✅ SOLO CustomThemeProvider (que ahora incluye todo)
    <CustomThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Layout>
              <AnimatedRoutes />
            </Layout>
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </CustomThemeProvider>
  )
}

export default App