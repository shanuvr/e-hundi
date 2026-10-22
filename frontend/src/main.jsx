/* eslint-disable react-refresh/only-export-components -- app entrypoint, not an HMR module */
import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// The kiosk ships to temple devices, so the console is split out of its bundle.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Kiosk — the donor-facing screens a temple's device runs */}
        <Route path="/" element={<App />} />
        {/* Admin — the per-temple control panel */}
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div className="min-h-dvh w-full flex items-center justify-center bg-stone-950">
                  <span className="w-6 h-6 rounded-full border-2 border-amber-400/25 border-t-amber-400 animate-spin" />
                </div>
              }
            >
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
