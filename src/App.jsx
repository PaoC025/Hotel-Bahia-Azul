// App.js (actualizado)
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Servicios from './pages/Servicios'
import Habitaciones from './pages/Habitaciones'
import Blog from './pages/Blog'
import Contacto from './pages/Contacto'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider } from './context/AppContext'
import PromotionBanner from './components/PromotionBanner'

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
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App