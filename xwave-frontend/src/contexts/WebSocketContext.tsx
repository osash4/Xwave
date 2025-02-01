import React, { createContext, useEffect, useState, useCallback, useContext } from 'react';

interface WebSocketContextProps {
  ws: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: string) => void;
  messages: string[];
  connectionStatus: string;
  loading: boolean;
  error: string | null;
}

export const WebSocketContext = createContext<WebSocketContextProps>({
  ws: null,
  isConnected: false,
  sendMessage: () => {},
  messages: [],
  connectionStatus: 'Disconnected',
  loading: true,
  error: null,
});

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Conectar al WebSocket
  const connectWebSocket = useCallback(() => {
    if (ws && ws.readyState !== WebSocket.CLOSED && ws.readyState !== WebSocket.CLOSING) {
      console.warn('El WebSocket ya está conectado o en proceso de conexión.');
      return; // Si ya está conectado o en proceso de conexión, no hacer nada
    }

    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL || 'ws://127.0.0.1:8083/ws/');

    socket.onopen = () => {
      console.log('WebSocket conectado');
      setIsConnected(true);
      setConnectionStatus('Connected');
      setLoading(false);
      setError(null);
      setReconnectAttempts(0);
    };

    socket.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event.data);
        setMessages((prev) => [...prev, parsedMessage]);
      } catch (e) {
        console.error('Error al procesar el mensaje:', e);
      }
    };

    socket.onerror = () => {
      console.error('Error en la conexión WebSocket.');
      setError('Error en la conexión WebSocket.');
    };

    socket.onclose = (event) => {
      console.log(`WebSocket cerrado: ${event.reason || 'Sin motivo especificado'}`);
      setIsConnected(false);
      setConnectionStatus('Disconnected');
      setLoading(false);

      if (event.code !== 1000) {
        setError('La conexión WebSocket fue cerrada inesperadamente.');
        setReconnectAttempts((prev) => prev + 1);
        
        // Limitación de los intentos de reconexión
        if (reconnectAttempts < 5) {
          setTimeout(() => connectWebSocket(), Math.min(5000, 1000 * reconnectAttempts)); // Expone el intento
        } else {
          setError('No se pudo reconectar después de varios intentos.');
        }
      }
    };

    setWs(socket);
  }, [ws, reconnectAttempts]);  // Dependemos de ws para controlar el estado de la conexión

  // Conectar cuando el componente se monta y limpiar la conexión cuando se desmonta
  useEffect(() => {
    if (!ws) {
      connectWebSocket();
    }
    return () => {
      if (ws) {
        console.log('Cerrando WebSocket...');
        ws.close(1000, 'Componente desmontado');
      }
    };
  }, [ws, connectWebSocket]);  // Dependemos de ws y connectWebSocket para controlar los efectos

  // Función para enviar mensajes a través del WebSocket
  const sendMessage = useCallback(
    (message: string) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(message);
        console.log('Mensaje enviado:', message);
      } else {
        console.warn('No se puede enviar el mensaje, WebSocket no conectado.');
      }
    },
    [ws]
  );

  return (
    <WebSocketContext.Provider
      value={{
        ws,
        isConnected,
        sendMessage,
        messages,
        connectionStatus,
        loading,
        error,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket debe ser usado dentro de un WebSocketProvider');
  }
  return context;
};
