import React, { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;  // Permitimos cualquier tipo de JSX como hijo
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn } = useAuth();  // Accede al estado de autenticación
  const navigate = useNavigate();  // Usamos useNavigate para redirecciones programáticas

  useEffect(() => {
    // Si el usuario no está autenticado, redirige al login
    if (!isSignedIn) {
      navigate('/login', { replace: true });
    }
  }, [isSignedIn, navigate]);  // Asegúrate de que la dependencia sea el estado de autenticación

  // Mientras se verifica el estado de autenticación, mostramos un "Cargando..."
  if (isSignedIn === undefined) {
    return <div>Loading...</div>;  // Aquí podrías poner un spinner si lo prefieres
  }

  // Si no está autenticado, no renderizamos los hijos ni mostramos nada
  if (!isSignedIn) {
    return <div>Redirecting...</div>;  // Puedes personalizar este texto
  }

  // Si está autenticado, renderiza los hijos
  return <>{children}</>;
};

export default ProtectedRoute;
