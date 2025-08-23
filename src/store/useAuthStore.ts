import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (!firebaseUser) {
        throw new Error('Aucun utilisateur retourné après authentification');
      }

      const user: User = {
        id: firebaseUser.uid,
        username: firebaseUser.email ?? 'Utilisateur',
      };

      set({ user, isAuthenticated: true });
      return true;
    } catch (error: unknown) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),

  setLoading: (loading) => set({ isLoading: loading }),
}));

// Initialize auth state listener
onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
  const { setUser, setLoading } = useAuthStore.getState();

  if (firebaseUser) {
    const user: User = {
      id: firebaseUser.uid,
      username: firebaseUser.email ?? 'Utilisateur',
    };
    setUser(user);
  } else {
    setUser(null);
  }

  setLoading(false);
});

