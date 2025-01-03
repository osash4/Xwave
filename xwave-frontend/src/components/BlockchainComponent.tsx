import { useState } from "react";
import { 
  getAccountBalance, 
  addTransaction, 
  checkSystemHealth, 
  initializeBlockchainConnection 
} from '../services/api';  

const BlockchainComponent = () => {
  const [balance, setBalance] = useState<string | null>(null);
  const [transactionResult, setTransactionResult] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<any>(null);
  
  const handleGetBalance = async (address: string) => {
    try {
      const balance = await getAccountBalance(address);  // Llamada a la función en api.js
      setBalance(balance);
    } catch (error) {
      console.error('Error al obtener el balance:', error);
    }
  };

  const handleSendTransaction = async (sender: string, receiver: string, amount: number) => {
    try {
      const result = await addTransaction(sender, receiver, amount);  // Llamada a la función en api.js
      setTransactionResult(result);
    } catch (error) {
      console.error('Error al enviar la transacción:', error);
    }
  };

  const handleCheckSystemHealth = async () => {
    try {
      const health = await checkSystemHealth();  // Llamada a la función en api.js
      setSystemHealth(health);
    } catch (error) {
      console.error('Error al verificar la salud del sistema:', error);
    }
  };

  const handleBlockchainConnection = async () => {
    try {
      const isConnected = await initializeBlockchainConnection();  // Llamada a la función en api.js
      if (isConnected) {
        alert('Conexión exitosa con la blockchain');
      } else {
        alert('Error al conectar con la blockchain');
      }
    } catch (error) {
      console.error('Error al verificar la conexión:', error);
    }
  };

  return (
    <div>
      <button onClick={handleBlockchainConnection}>Verificar Conexión</button>
      <div>
        <button onClick={() => handleGetBalance("0x1234567890abcdef")}>Obtener Balance</button>
        <p>{balance && `Balance: ${balance}`}</p>
      </div>
      <div>
        <button onClick={() => handleSendTransaction("0x1234567890abcdef", "0x9876543210abcdef", 10)}>Enviar Transacción</button>
        <p>{transactionResult && `Transacción: ${transactionResult}`}</p>
      </div>
      <div>
        <button onClick={handleCheckSystemHealth}>Verificar Salud del Sistema</button>
        <p>{systemHealth && `Estado del sistema: ${JSON.stringify(systemHealth)}`}</p>
      </div>
    </div>
  );
};

export default BlockchainComponent;
