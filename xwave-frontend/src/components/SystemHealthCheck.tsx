import { useEffect, useState } from 'react';
import { checkSystemHealth } from '../services/api';

const SystemHealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthStatus = async () => {
    setLoading(true); // Mostrar el estado de carga al reintentar
    setError(null); // Limpiar el error previo
    try {
      const health = await checkSystemHealth();
      setHealthStatus(health);
    } catch (err) {
      setError('No se pudo obtener la salud del sistema. Por favor, inténtalo nuevamente.');
      console.error('Error al obtener la salud del sistema:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus(); // Llamar a la función al montar el componente
  }, []);

  if (loading) {
    return <div>Comprobando estado del sistema...</div>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={fetchHealthStatus}>Reintentar</button>
      </div>
    );
  }

  return (
    <div>
      <h3>Estado del Sistema:</h3>
      <pre>{JSON.stringify(healthStatus, null, 2)}</pre>
    </div>
  );
};

export default SystemHealthCheck;
