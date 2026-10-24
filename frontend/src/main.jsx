/* eslint-disable react-refresh/only-export-components -- app entrypoint, not an HMR module */
import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// The kiosk ships to temple devices, so the console is split out of its bundle.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy.jsx'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const Disclaimer = lazy(() => import('./pages/Disclaimer.jsx'));

const PageFallback = (
  <div className="min-h-dvh w-full flex items-center justify-center bg-stone-950">
    <span className="w-6 h-6 rounded-full border-2 border-amber-400/25 border-t-amber-400 animate-spin" />
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Kiosk — the donor-facing screens a temple's device runs */}
        <Route path="/" element={<App />} />
        
        {/* Public & Compliance Pages */}
        <Route path="/about" element={<Suspense fallback={PageFallback}><About /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={PageFallback}><Contact /></Suspense>} />
        <Route path="/terms" element={<Suspense fallback={PageFallback}><Terms /></Suspense>} />
        <Route path="/privacy" element={<Suspense fallback={PageFallback}><Privacy /></Suspense>} />
        <Route path="/refund-policy" element={<Suspense fallback={PageFallback}><RefundPolicy /></Suspense>} />
        <Route path="/shipping-policy" element={<Suspense fallback={PageFallback}><ShippingPolicy /></Suspense>} />
        <Route path="/pricing" element={<Suspense fallback={PageFallback}><Pricing /></Suspense>} />
        <Route path="/disclaimer" element={<Suspense fallback={PageFallback}><Disclaimer /></Suspense>} />

        {/* Admin — the per-temple control panel */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={PageFallback}>
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
