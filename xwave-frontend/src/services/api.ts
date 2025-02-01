import axios from 'axios';

// Crear una instancia de axios con timeout y baseURL
const instance = axios.create({
  baseURL: 'http://localhost:8083/api', // Utiliza el prefijo del proxy configurado en Vite
  timeout: 30000, // Timeout de 30 segundos para cada solicitud
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Verifica la conexión inicial con la blockchain.
 * @returns {Promise<boolean>} True si la conexión es exitosa, False en caso contrario.
 */
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
    console.error('Error al verificar la conexión:', error instanceof Error ? error.message : error);
    return false;
  }
};

/**
 * Realiza una solicitud JSON-RPC genérica al servidor backend.
 * @param {string} method - Método JSON-RPC.
 * @param {any[]} params - Parámetros de la solicitud.
 * @returns {Promise<any>} Resultado de la solicitud.
 */
const makeJsonRpcRequest = async (method: string, params: any[] = []) => {
  try {
    console.log(`Haciendo solicitud JSON-RPC: método="${method}"`);
    const response = await instance.post('', {
      jsonrpc: '2.0',
      method,
      params,
      id: 1,
    });

    if (response.data && response.data.result) {
      return response.data.result;
    } else {
      throw new Error(response.data.error?.message || 'Respuesta inválida del servidor');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error en Axios para método "${method}":`, error.message);
      console.error('Detalles del error:', error.response?.data);
    } else {
      console.error(`Error desconocido en método "${method}":`, error);
    }
    throw error;
  }
};

/**
 * Verifica la salud del sistema.
 * @returns {Promise<any>} Estado del sistema.
 */
export const checkSystemHealth = async (): Promise<any> => {
  try {
    const response = await instance.get('/system_health'); // Aquí cambias a GET
    return response.data;
  } catch (error) {
    console.error('Error al obtener la salud del sistema:', error);
    throw new Error('Error al obtener la salud del sistema');
  }
};
/**
 * Obtiene la cadena de bloques.
 * @returns {Promise<any>} Nombre de la cadena de bloques.
 */
export const getBlockchain = async (): Promise<any> => {
  return makeJsonRpcRequest('system_chain');
};

/**
 * Obtiene el balance de una cuenta específica.
 * @param {string} address - Dirección de la cuenta.
 * @returns {Promise<any>} Balance de la cuenta.
 */
export const getAccountBalance = async (address: string): Promise<any> => {
  return makeJsonRpcRequest('get_balance', [address]);
};

/**
 * Envía una transacción desde un remitente a un destinatario.
 * @param {string} sender - Dirección del remitente.
 * @param {string} receiver - Dirección del destinatario.
 * @param {number} amount - Cantidad a transferir.
 * @returns {Promise<any>} Resultado de la transacción.
 */
export const addTransaction = async (sender: string, receiver: string, amount: number): Promise<any> => {
  return makeJsonRpcRequest('add_transaction', [sender, receiver, amount]);
};

/**
 * Agrega un validador a la red.
 * @param {string} validatorAddress - Dirección del validador.
 * @param {string} stake - Cantidad de stake asignada.
 * @returns {Promise<any>} Resultado de la operación.
 */
export const addValidator = async (validatorAddress: string, stake: string): Promise<any> => {
  return makeJsonRpcRequest('add_validator', [validatorAddress, stake]);
};

/**
 * Obtiene la altura actual del bloque.
 * @returns {Promise<number>} Altura del bloque.
 */
export const getBlockHeight = async (): Promise<number> => {
  try {
    console.log('Obteniendo la altura del bloque...');
    const response = await instance.get('/block-height');
    return response.data.height;
  } catch (error) {
    console.error('Error al obtener la altura del bloque:', error);
    throw new Error('Error desconocido al obtener la altura del bloque');
  }
};
