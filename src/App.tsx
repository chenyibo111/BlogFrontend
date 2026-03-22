import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { TopNavBar } from './components/TopNavBar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ArchivePage } from './pages/ArchivePage';
import { AboutPage } from './pages/AboutPage';
import { ArticlePage } from './pages/ArticlePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WritePage } from './pages/WritePage';
import { ProfilePage } from './pages/ProfilePage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: { pathname: location.pathname } }} replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirect to home if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-on-surface-variant">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <>
          <TopNavBar />
          <HomePage />
          <Footer />
        </>
      } />
      <Route path="/blog" element={
        <>
          <TopNavBar />
          <ArchivePage />
          <Footer />
        </>
      } />
      <Route path="/archive" element={
        <>
          <TopNavBar />
          <ArchivePage />
          <Footer />
        </>
      } />
      <Route path="/about" element={
        <>
          <TopNavBar />
          <AboutPage />
          <Footer />
        </>
      } />
      <Route path="/post/:id" element={
        <>
          <TopNavBar />
          <ArticlePage />
          <Footer />
        </>
      } />
      <Route path="/post" element={
        <>
          <TopNavBar />
          <ArticlePage />
          <Footer />
        </>
      } />

      {/* Public Routes - Auth */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/write" element={
        <ProtectedRoute>
          <WritePage />
        </ProtectedRoute>
      } />
      <Route path="/write/:slug" element={
        <ProtectedRoute>
          <WritePage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">404</h1>
            <p className="text-on-surface-variant">Page not found</p>
          </div>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
