import React, { useState } from 'react';
import { addTransaction } from '../../services/api';

const TransactionForm = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const amountNumber = parseFloat(amount); // Convierte a número

    if (isNaN(amountNumber)) {
      setError('Por favor ingrese una cantidad válida');
      return;
    }

    try {
      const result = await addTransaction(from, to, amountNumber); // Pasa el valor como número
      setResponse(result);
      setError(null);
    } catch (err: any) {
      setError('Error al agregar la transacción');
    }
  };

  return (
    <div>
      <h2>Agregar Transacción</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Desde (Dirección):</label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Hacia (Dirección):</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cantidad:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Enviar Transacción</button>
      </form>
      {response && <p>Transacción agregada: {response.hash}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default TransactionForm;
