import { useEffect, useState } from 'react';
import { getBlockHeight, checkSystemHealth } from '../services/api';

export const BlockchainInfo = () => {
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const height = await getBlockHeight();
        const health = await checkSystemHealth();
        setBlockHeight(height);
        setSystemHealth(health);
      } catch (err) {
        setError('Error al conectar con la blockchain.');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Información de la Blockchain</h2>
      <p>Altura del bloque: {blockHeight !== null ? blockHeight : 'Cargando...'}</p>
      <p>Estado del sistema: {systemHealth ? JSON.stringify(systemHealth) : 'Cargando...'}</p>
    </div>
  );
};
