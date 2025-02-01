import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  photoURL?: string;
  uid: string;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user && window.location.pathname !== '/profile') {
      navigate('/profile');
    }
  }, [user, navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      if (email === 'test@example.com' && password === 'password123') {
        const newUser: User = {
          uid: '1234',
          email: 'test@example.com',
          photoURL: 'https://example.com/photo.jpg',
          displayName: 'John Doe',
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/exploreNow');
  };

  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
