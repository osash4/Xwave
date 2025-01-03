import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Definimos la interfaz para el contexto con displayName agregado
interface User {
  photoURL?: string;
  uid: string;
  email: string;
  displayName?: string;  // Agregamos displayName como propiedad opcional
}

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Creación del contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor de autenticación
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);  // Usamos el tipo User actualizado
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está en el localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Cargar el usuario del localStorage
    }
  }, []);

  // Método para iniciar sesión (usando credenciales simples para desarrollo)
  const signIn = async (email: string, password: string) => {
    try {
      if (email === 'test@example.com' && password === 'password123') {
        // Simulamos un login exitoso, añadiendo displayName
        const newUser: User = { 
          uid: '1234', 
          email: 'test@example.com', 
          photoURL: 'https://example.com/photo.jpg', 
          displayName: 'John Doe'  // Agregamos displayName al usuario
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser)); // Guardar en el localStorage
        navigate('/profile'); // Redirigimos al perfil
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
      throw error;
    }
  };

  // Método para cerrar sesión
  const signOut = async () => {
    try {
      setUser(null); // Simulamos logout
      localStorage.removeItem('user'); // Limpiamos el localStorage
      navigate('/exploreNow'); // Redirigimos a 'exploreNow' después de hacer logout
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
