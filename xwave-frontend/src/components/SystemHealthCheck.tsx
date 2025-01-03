import { useEffect } from 'react';
import { checkSystemHealth } from '../services/api';  // Asegúrate de que la ruta sea correcta

const SystemHealthCheck = () => {
  useEffect(() => {
    // Llamada a checkSystemHealth cuando el componente se monta
    checkSystemHealth()
      .then((health) => {
        console.log('Estado del sistema:', health);
      })
      .catch((error) => {
        console.error('No se pudo obtener la salud del sistema:', error);
      });
  }, []);  // El arreglo vacío [] asegura que solo se ejecute una vez, al montar el componente

  return <div>Comprobando estado del sistema...</div>;
};

export default SystemHealthCheck;
