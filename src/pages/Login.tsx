import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useAlertStore } from '../store/useAlertStore';
import { LogIn, AlertCircle } from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const showAlert = useAlertStore(state => state.show);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      showAlert('Connexion réussie', 'Vous êtes maintenant connecté à Scopilot.', () => {
        navigate('/dashboard');
      });
    } catch (error: any) {
      // Gestion des erreurs Firebase spécifiques
      switch (error.code) {
        case 'auth/invalid-credential':
          setError('Email ou mot de passe incorrect. Vérifiez vos identifiants ou inscrivez-vous si vous n\'avez pas de compte.');
          break;
        case 'auth/user-not-found':
          setError('Aucun compte trouvé avec cet email');
          break;
        case 'auth/wrong-password':
          setError('Mot de passe incorrect');
          break;
        case 'auth/invalid-email':
          setError('Format d\'email invalide');
          break;
        case 'auth/user-disabled':
          setError('Ce compte a été désactivé');
          break;
        case 'auth/too-many-requests':
          setError('Trop de tentatives. Veuillez réessayer plus tard');
          break;
        default:
          setError('Erreur de connexion. Veuillez réessayer');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-surface rounded-xl shadow-lg dark:bg-surface-dark">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-text dark:text-text-dark">Scopilot</h2>
          <p className="mt-2 text-sm text-gray-600 italic">Cadrez. Engagez. Avancez.</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
            
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            icon={LogIn}
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;