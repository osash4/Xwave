import { useState, useEffect } from 'react';
import { getBlockchain } from '../../services/api';

const BlockchainView = () => {
  const [blockchain, setBlockchain] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlockchain = async () => {
      try {
        const chain = await getBlockchain();
        setBlockchain(chain);
        setError(null);
      } catch (err: any) {
        setError('Error al obtener la cadena de bloques');
      }
    };

    fetchBlockchain();
  }, []);

  return (
    <div>
      <h2>Vista de la Blockchain</h2>
      {error && <p>{error}</p>}
      <ul>
        {blockchain.map((block: any, index: number) => (
          <li key={index}>
            <strong>Bloque {index + 1}:</strong>
            <pre>{JSON.stringify(block, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlockchainView;
