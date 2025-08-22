import { create } from 'zustand';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const user: User = {
        id: firebaseUser.uid,
        username: firebaseUser.email || 'Utilisateur'
      };
      
      set({ user, isAuthenticated: true });
      return true;
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  },
  
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
  
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  }
}));

// Initialize auth state listener
onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
  const { setUser, setLoading } = useAuthStore.getState();
  
  if (firebaseUser) {
    const user: User = {
      id: firebaseUser.uid,
      username: firebaseUser.email || 'Utilisateur'
    };
    setUser(user);
  } else {
    setUser(null);
  }
  
  setLoading(false);
});