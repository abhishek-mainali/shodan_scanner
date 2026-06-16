import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy load pages for bundle optimization
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ScanPage = lazy(() => import('./pages/ScanPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const AlertsPage = lazy(() => import('./pages/AlertsPage'));
const TargetsPage = lazy(() => import('./pages/TargetsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Phase 5 New Pages
const SearchPage = lazy(() => import('./pages/SearchPage'));
const TemplatesPage = lazy(() => import('./pages/TemplatesPage'));
const ClientPortalPage = lazy(() => import('./pages/ClientPortalPage'));

const PageLoader = () => (
  <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
    <Loader2 className="w-12 h-12 text-accent animate-spin" />
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Loading Intelligence Module...</span>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/portal/:token" element={<ClientPortalPage />} />
                
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="scan" element={<ProtectedRoute roles={['ADMIN', 'ANALYST']}><ScanPage /></ProtectedRoute>} />
                  <Route path="results/:id" element={<ResultsPage />} />
                  <Route path="alerts" element={<AlertsPage />} />
                  <Route path="targets" element={<TargetsPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="templates" element={<TemplatesPage />} />
                  <Route path="settings" element={<ProtectedRoute roles={['ADMIN']}><SettingsPage /></ProtectedRoute>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
