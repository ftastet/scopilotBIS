import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, Folder } from 'lucide-react';
import Button from '../UI/Button';

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const currentProject = useProjectStore(state => state.currentProject);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isOnDashboard = location.pathname === '/dashboard';
  const isOnProject = location.pathname.startsWith('/project/');

  return (
    <header className="fixed top-0 w-full z-50 bg-primary text-background shadow-sm border-b border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                <Folder className="h-4 w-4 text-background" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Scopilot</h1>
                <p className="text-xs italic text-background/80">Cadrez. Engagez. Avancez.</p>
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
                <div className="h-6 border-l border-background mx-4" />
                <div className="flex-1 text-center">
                  <span className="font-bold text-2xl">{currentProject.name}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="h-6 border-l border-background mx-4" />
            <span className="text-sm text-background/80">
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