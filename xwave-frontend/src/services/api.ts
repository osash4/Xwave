import axios from 'axios';

// URL del backend actualizada
const API_URL = 'http://127.0.0.1:8083/rpc'; // Cambié la URL a la proporcionada

// Crear una instancia de axios con timeout y baseURL
const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Timeout de 10 segundos para cada solicitud
});

// Función para inicializar la conexión
export const initializeBlockchainConnection = async (): Promise<boolean> => {
  try {
    console.log('Verificando la conexión con la blockchain...');
    const response = await instance.post('', {
      jsonrpc: '2.0',
      method: 'system_health',
      params: [],
      id: 1,
    });

    if (response.data && response.data.result) {
      console.log('Conexión con la blockchain establecida correctamente.');
      return true;
    } else {
      console.error('Error al conectar con la blockchain:', response.data.error || 'Respuesta inválida');
      return false;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al verificar la conexión:', errorMessage);
    return false;
  }
};

// Función genérica para hacer solicitudes JSON-RPC
const makeJsonRpcRequest = async (method: string, params: any[] = []): Promise<any> => {
  try {
    console.log(`Haciendo solicitud JSON-RPC a ${API_URL} con método: ${method}`);
    const response = await instance.post('', {
      jsonrpc: '2.0',
      method,
      params,
      id: 1,
    });

    if (response.data && response.data.result) {
      console.log(`Respuesta JSON-RPC para método "${method}":`, response.data.result);
      return response.data.result;
    } else {
      console.error(`Error en la respuesta JSON-RPC para el método "${method}":`, response.data.error || 'Respuesta inválida');
      throw new Error(response.data.error?.message || 'Error desconocido');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error(`Error al hacer la solicitud JSON-RPC para método "${method}":`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Función para obtener la cadena de bloques
export const getBlockchain = async (): Promise<any> => {
  return makeJsonRpcRequest('system_chain');
};

// Función para obtener el balance de una cuenta
export const getAccountBalance = async (address: string): Promise<any> => {
  return makeJsonRpcRequest('account_balance', [address]);
};

// Función para agregar una transacción
export const addTransaction = async (sender: string, receiver: string, amount: number): Promise<any> => {
  try {
    console.log(`Enviando transacción de ${sender} a ${receiver} por ${amount} tokens...`);
    const result = await makeJsonRpcRequest('add_transaction', [sender, receiver, amount]);
    console.log('Transacción enviada exitosamente:', result);
    return result;
  } catch (error) {
    console.error('Error al enviar la transacción:', error);
    throw new Error('Error desconocido al enviar la transacción');
  }
};

// Función para agregar un validador
export const addValidator = async (validatorAddress: string, stake: string): Promise<any> => {
  try {
    console.log(`Agregando validador: ${validatorAddress} con stake: ${stake}`);
    const result = await makeJsonRpcRequest('add_validator', [validatorAddress]);
    console.log('Validador agregado exitosamente:', result);
    return result;
  } catch (error) {
    console.error('Error al agregar el validador:', error instanceof Error ? error.message : error);
    throw new Error('Error desconocido al agregar el validador');
  }
};

// Función para verificar la salud del sistema
export const checkSystemHealth = async (): Promise<any> => {
  try {
    console.log('Verificando la salud del sistema...');
    const result = await makeJsonRpcRequest('system_health');
    console.log('Estado del sistema:', result);
    return result;
  } catch (error) {
    console.error('Error al verificar la salud del sistema:', error);
    throw new Error('Error desconocido al verificar la salud del sistema');
  }
};


export const getBlockHeight = async () => {
  // Lógica para obtener la altura del bloque, por ejemplo, una solicitud API
  const response = await fetch('http://tu-api.com/block-height');
  const data = await response.json();
  return data.height;
};

