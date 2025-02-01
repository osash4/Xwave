import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

import { BlockchainProvider } from './contexts/BlockchainContext';
import { WebSocketProvider, useWebSocket } from './contexts/WebSocketContext';

import { WalletDashboard } from './components/wallet/WalletDashboard';
import { ArtistPortal } from './components/artist/ArtistPortal';
import { ContentMarketplace } from './components/marketplace/ContentMarketplace';
import { WalletConnector } from './components/wallet/WalletConnector';

import ExploreNow from './pages/ExploreNow/ExploreNow';
import ExploreMusic from './components/Music/ExploreMusic';
import ExploreVideo from './components/Video/ExploreVideos';
import ExploreGaming from './components/Gaming/ExploreGaming';
import ExploreEducation from './components/Education/ExploreEducation';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ProfilePage from './pages/HomePage/ProfilePage/ProfilePage';
import MusicPage from './pages/HomePage/ProfilePage/MusicPage';

import BlockchainInfo from './components/blockchain/BlockchainInfo';
import TransactionForm from './components/blockchain/TransactionForm';
import BlockchainView from './components/blockchain/BlockchainView';
import ValidatorForm from './components/blockchain/ValidatorForm';

import SystemHealthCheck from './components/SystemHealthCheck';
import GlobalStyle from './styles/GlobalStyle';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <AuthProvider>
          <BlockchainProvider>
            <WebSocketProvider>
              <SystemHealthCheck />
              <AppRoutes />
            </WebSocketProvider>
          </BlockchainProvider>
        </AuthProvider>
      </Router>
    </>
  );
};

const AppRoutes: React.FC = () => {
  const { messages, connectionStatus, loading, error } = useWebSocket();

  if (loading) return <p>Cargando WebSocket...</p>;
  if (error) return <p>Error al conectar WebSocket: {error}</p>;

  // Mostrar mensajes de WebSocket (si lo deseas)
  // Nota: Puedes eliminar este bloque si no es necesario para la interfaz de usuario
  return (
    <div>
      {/* Mostrar estado de la conexión y mensajes (solo para debug) */}
      <p>Estado de conexión: {connectionStatus}</p>
      <ul>
        {messages.map((msg: string, index: number) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/explore" element={<ExploreNow />} />
        <Route path="/explore/music" element={<ExploreMusic />} />
        <Route path="/explore/video" element={<ExploreVideo />} />
        <Route path="/explore/gaming" element={<ExploreGaming />} />
        <Route path="/explore/education" element={<ExploreEducation />} />
        <Route path="/music" element={<MusicPage />} />

        {/* Rutas protegidas */}
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><WalletDashboard /></ProtectedRoute>} />
        <Route path="/artist-portal" element={<ProtectedRoute><ArtistPortal /></ProtectedRoute>} />
        <Route path="/wallet-connector" element={<ProtectedRoute><WalletConnector /></ProtectedRoute>} />
        <Route path="/marketplace" element={<ProtectedRoute><ContentMarketplace /></ProtectedRoute>} />
        <Route path="/blockchain-info" element={<ProtectedRoute><BlockchainInfo /></ProtectedRoute>} />
        <Route path="/add-transaction" element={<ProtectedRoute><TransactionForm /></ProtectedRoute>} />
        <Route path="/view-blockchain" element={<ProtectedRoute><BlockchainView /></ProtectedRoute>} />
        <Route path="/add-validator" element={<ProtectedRoute><ValidatorForm /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
