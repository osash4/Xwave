// /src/components/BlockHeightDisplay.js
import React, { useEffect, useState } from 'react';
import { getBlockHeight } from '../api/blockchainService';

const BlockHeightDisplay = () => {
  const [blockHeight, setBlockHeight] = useState(null);

  useEffect(() => {
    const fetchBlockHeight = async () => {
      try {
        const height = await getBlockHeight();
        setBlockHeight(height);
      } catch (error) {
        console.error("Error al obtener la altura del bloque", error);
      }
    };

    fetchBlockHeight();
  }, []);

  return (
    <div>
      {blockHeight ? (
        <p>La altura del bloque es: {blockHeight}</p>
      ) : (
        <p>Cargando altura del bloque...</p>
      )}
    </div>
  );
};

export default BlockHeightDisplay;
