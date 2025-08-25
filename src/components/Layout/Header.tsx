import { Navbar, Button } from 'flowbite-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useAlertStore } from '../../store/useAlertStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Home, Folder } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

const Header = () => {
  const { user, logout } = useAuthStore();
  const currentProject = useProjectStore((state) => state.currentProject);
  const showAlert = useAlertStore((state) => state.show);
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
    <Navbar fluid rounded className="fixed top-0 z-50 w-full">
      <Navbar.Brand href="/dashboard" className="cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Folder className="h-4 w-4 text-white" />
        </div>
        <span className="self-center whitespace-nowrap text-xl font-bold">Scopilot</span>
      </Navbar.Brand>
      <div className="flex items-center gap-2 md:order-2">
        <ThemeToggle />
        <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
          {user ? `Connecté en tant que ${user.username}` : ''}
        </span>
        <Button color="light" size="xs" onClick={handleLogout}>
          <LogOut className="mr-1 h-4 w-4" /> Déconnexion
        </Button>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {!isOnDashboard && (
          <Navbar.Link href="#" onClick={() => navigate('/dashboard')}>
            <Home className="mr-1 h-4 w-4" /> Accueil
          </Navbar.Link>
        )}
        {isOnProject && currentProject && (
          <Navbar.Link href="#" active>
            {currentProject.name}
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
