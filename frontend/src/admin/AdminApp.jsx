import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './AdminLayout';

// Each console page is its own chunk, so opening Slogans doesn't pull the
// reports table or the settings danger zone with it.
const Login = lazy(() => import('./pages/Login'));
const Reports = lazy(() => import('./pages/Reports'));
const TempleProfile = lazy(() => import('./pages/TempleProfile'));
const Slogans = lazy(() => import('./pages/Slogans'));
const Branding = lazy(() => import('./pages/Branding'));
const Payments = lazy(() => import('./pages/Payments'));
const Darshan = lazy(() => import('./pages/Darshan'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('../pages/About'));
const Pricing = lazy(() => import('../pages/Pricing'));
const Contact = lazy(() => import('../pages/Contact'));
const Terms = lazy(() => import('../pages/Terms'));
const Privacy = lazy(() => import('../pages/Privacy'));
const RefundPolicy = lazy(() => import('../pages/RefundPolicy'));
const ShippingPolicy = lazy(() => import('../pages/ShippingPolicy'));
const Disclaimer = lazy(() => import('../pages/Disclaimer'));

function PageFallback() {
  return (
    <div className="flex flex-col items-center gap-3 py-24">
      <span className="w-6 h-6 rounded-full border-2 border-amber-400/25 border-t-amber-400 animate-spin" />
      <p className="text-[10px] uppercase tracking-[0.22em] text-stone-600">Loading</p>
    </div>
  );
}

export default function AdminApp() {
  return (
    <Routes>
      {/* Sign-in sits outside AdminLayout — no sidebar, no top bar */}
      <Route
        path="login"
        element={
          <Suspense fallback={<PageFallback />}>
            <Login />
          </Suspense>
        }
      />
      <Route element={<AdminLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<PageFallback />}>
              <Reports />
            </Suspense>
          }
        />
        <Route
          path="temple"
          element={
            <Suspense fallback={<PageFallback />}>
              <TempleProfile />
            </Suspense>
          }
        />
        <Route
          path="slogans"
          element={
            <Suspense fallback={<PageFallback />}>
              <Slogans />
            </Suspense>
          }
        />
        <Route
          path="branding"
          element={
            <Suspense fallback={<PageFallback />}>
              <Branding />
            </Suspense>
          }
        />
        <Route
          path="payments"
          element={
            <Suspense fallback={<PageFallback />}>
              <Payments />
            </Suspense>
          }
        />
        {/* Compliance and Legal Pages with Admin Theme */}
        <Route path="about" element={<Suspense fallback={<PageFallback />}><About /></Suspense>} />
        <Route path="pricing" element={<Suspense fallback={<PageFallback />}><Pricing /></Suspense>} />
        <Route path="contact" element={<Suspense fallback={<PageFallback />}><Contact /></Suspense>} />
        <Route path="terms" element={<Suspense fallback={<PageFallback />}><Terms /></Suspense>} />
        <Route path="privacy" element={<Suspense fallback={<PageFallback />}><Privacy /></Suspense>} />
        <Route path="refund-policy" element={<Suspense fallback={<PageFallback />}><RefundPolicy /></Suspense>} />
        <Route path="shipping-policy" element={<Suspense fallback={<PageFallback />}><ShippingPolicy /></Suspense>} />
        <Route path="disclaimer" element={<Suspense fallback={<PageFallback />}><Disclaimer /></Suspense>} />

        <Route path="darshan" element={<Navigate to="/admin/slogans" replace />} />
        <Route path="reports" element={<Navigate to="/admin" replace />} />
        <Route path="settings" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Reports />} />
      </Route>
    </Routes>
  );
}
