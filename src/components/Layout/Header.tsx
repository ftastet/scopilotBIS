import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useAlertStore } from '../../store/useAlertStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, Folder, Moon, Sun } from 'lucide-react';
import Button from '../UI/Button';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const currentProject = useProjectStore(state => state.currentProject);
  const showAlert = useAlertStore(state => state.show);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      showAlert('Déconnexion réussie', 'Vous avez été déconnecté avec succès.', () => {
        navigate('/login');
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      showAlert('Erreur', 'Erreur lors de la déconnexion. Veuillez réessayer.');
    }
  };

  const isOnDashboard = location.pathname === '/dashboard';
  const isOnProject = location.pathname.startsWith('/project/');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <header className="fixed top-0 w-full z-50 bg-primary text-background shadow-sm border-b border-primary dark:bg-primary-dark dark:text-background-dark dark:border-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center dark:bg-accent-dark">
                <Folder className="h-4 w-4 text-background dark:text-background-dark" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Scopilot</h1>
                <p className="text-xs italic text-background/80 dark:text-background-dark/80">Cadrez. Engagez. Avancez.</p>
              </div>
            </div>

            {!isOnDashboard && (
              <Button
                variant="secondary"
                size="sm"
                icon={Home}
                onClick={() => navigate('/dashboard')}
              >
                Accueil
              </Button>
            )}

            {isOnProject && currentProject && (
              <>
                <div className="h-6 border-l border-background mx-4 dark:border-background-dark" />
                <div className="flex-1 text-center">
                  <span className="font-bold text-2xl">{currentProject.name}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              size="sm"
              icon={isDarkMode ? Sun : Moon}
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Basculer le mode sombre"
            />
            <div className="h-6 border-l border-background mx-4 dark:border-background-dark" />
            <span className="text-sm text-background/80 dark:text-background-dark/80">
              Connecté en tant que <span className="font-medium">{user?.username}</span>
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={LogOut}
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;