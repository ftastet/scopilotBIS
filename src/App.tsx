import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { useProjectStore } from './store/useProjectStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Project from './pages/Project';
import Header from './components/Layout/Header';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  }));
  const fetchProjects = useProjectStore(state => state.fetchProjects);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isAuthenticated) {
      fetchProjects().then(unsub => {
        unsubscribe = unsub;
      });
    }

    return () => unsubscribe?.();
  }, [isAuthenticated, fetchProjects]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const withAuth = (element: JSX.Element) =>
    isAuthenticated ? element : <Navigate to="/login" />;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pt-16">
        {isAuthenticated && <Header />}
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={withAuth(<Dashboard />)} />
          <Route path="/project/:id" element={withAuth(<Project />)} />
          <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
