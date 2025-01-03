import React, { useState } from 'react';
import { addValidator } from '../../services/api';

const ValidatorForm = () => {
  const [address, setAddress] = useState('');
  const [stake, setStake] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await addValidator(address, stake);
      setResponse(result);
      setError(null);
    } catch (err: any) {
      setError('Error al agregar el validador');
    }
  };

  return (
    <div>
      <h2>Agregar Validador</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Dirección:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Apuesta (Stake):</label>
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            required
          />
        </div>
        <button type="submit">Agregar Validador</button>
      </form>
      {response && <p>{response.message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ValidatorForm;
