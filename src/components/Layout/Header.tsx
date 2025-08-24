import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useAlertStore } from '../../store/useAlertStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, Folder } from 'lucide-react';
import Button from '../UI/Button';
import ThemeToggle from '../UI/ThemeToggle';

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

  return (
    <header className="navbar bg-base-100 shadow-sm fixed top-0 w-full z-50">
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-content">
            <Folder className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Scopilot</h1>
            <p className="text-xs italic">Cadrez. Engagez. Avancez.</p>
          </div>
        </div>

        {!isOnDashboard && (
          <Button
            variant="secondary"
            size="sm"
            icon={Home}
            onClick={() => navigate('/dashboard')}
            className="ml-4"
          >
            Accueil
          </Button>
        )}

        {isOnProject && currentProject && (
          <span className="ml-4 font-bold text-2xl">{currentProject.name}</span>
        )}
      </div>

      <div className="flex-none gap-2">
        <span className="text-sm mr-2">
          Connecté en tant que <span className="font-medium">{user?.username}</span>
        </span>
        <ThemeToggle />
        <Button
          variant="secondary"
          size="sm"
          icon={LogOut}
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
      </div>
    </header>
  );
};

export default Header;