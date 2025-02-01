import React, { useEffect, ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Spinner } from '../components/common/Spinner';

interface ProtectedRouteProps {
  children: ReactNode;  // Permitimos cualquier tipo de JSX como hijo
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn } = useAuth();  // Accede al estado de autenticación
  const navigate = useNavigate();  // Usamos useNavigate para redirecciones programáticas

  const [hasRedirected, setHasRedirected] = useState(false); // Controlamos si ya se ha hecho la redirección

  useEffect(() => {
    // Redirigir solo si no estamos autenticados
    if (isSignedIn === false) {
      if (!hasRedirected) { // Solo redirigir si no hemos redirigido antes
        setHasRedirected(true); // Marcamos que ya se redirigió
        navigate('/login', { replace: true }); // Redirige a la página de login
      }
    }
  }, [isSignedIn, hasRedirected, navigate]); // Eliminamos la dependencia de 'account'

  // Mientras se verifica el estado de autenticación, mostramos un "Cargando..."
  if (isSignedIn === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner /> {/* Aquí podrías poner un spinner de carga */}
        <p className="ml-4">Cargando...</p>  {/* Mensaje mientras se carga */}
      </div>
    );
  }

  // Si está autenticado, renderiza los hijos
  return <>{children}</>;
};

export default ProtectedRoute;
