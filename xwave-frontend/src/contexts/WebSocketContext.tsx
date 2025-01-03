import React, { createContext, useEffect, useState, useCallback, useContext } from 'react';

// Definimos las propiedades que tendrá el contexto de WebSocket
interface WebSocketContextProps {
  ws: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: string) => void;
  messages: string[]; // Agregamos la propiedad messages para almacenar los mensajes recibidos
  connectionStatus: string; // Agregamos la propiedad connectionStatus
}

// Creamos el contexto con valores por defecto
export const WebSocketContext = createContext<WebSocketContextProps>({
  ws: null,
  isConnected: false,
  sendMessage: () => {},
  messages: [], // Lista de mensajes por defecto vacía
  connectionStatus: 'Disconnected', // Estado de la conexión por defecto
});

// Definimos las props para el WebSocketProvider, que envolverá a los componentes hijos
interface WebSocketProviderProps {
  children: React.ReactNode;
}

// El WebSocketProvider manejará la conexión WebSocket y proporcionará el contexto a los componentes
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]); // Estado para los mensajes recibidos
  const [connectionStatus, setConnectionStatus] = useState('Disconnected'); // Estado para el estado de la conexión

  // Función para conectar el WebSocket
  const connectWebSocket = useCallback(() => {
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL || 'ws://127.0.0.1:8083/rpc');

    socket.onopen = () => {
      console.log('Conectado al WebSocket');
      setIsConnected(true);
      setConnectionStatus('Connected');
    };

    socket.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        console.log('Mensaje recibido:', parsedData);
        setMessages((prevMessages) => [...prevMessages, parsedData]);
      } catch (error) {
        console.error('Error al parsear mensaje:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('Error WebSocket:', error);
      // Reintentar la conexión cada 5 segundos en caso de error
      setTimeout(() => connectWebSocket(), 5000);
    };

    socket.onclose = (event) => {
      console.log('Conexión WebSocket cerrada', event.reason);
      setIsConnected(false);
      setConnectionStatus('Disconnected');
      // Reintentar la conexión cada 5 segundos si se cierra
      setTimeout(() => connectWebSocket(), 5000);
    };

    setWs(socket);
  }, []);

  // Usamos useEffect para conectarnos al WebSocket al montar el componente
  useEffect(() => {
    connectWebSocket();
    
    // Limpiamos la conexión cuando el componente se desmonta
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [connectWebSocket, ws]);

  // Función para enviar un mensaje a través del WebSocket
  const sendMessage = (message: string) => {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(message);
    } else {
      console.error('WebSocket no está conectado. Mensaje no enviado:', message);
    }
  };

  return (
    <WebSocketContext.Provider value={{ ws, isConnected, sendMessage, messages, connectionStatus }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook personalizado para acceder al contexto WebSocket
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket debe ser usado dentro de un WebSocketProvider');
  }
  return context;
};
