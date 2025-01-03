import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import BottomNavBar from '../../components/BottomNavBar/BottomNavBar';
import ShareButton from '../../components/ShareButton';

// Componente para mostrar cada ítem
const CategoryItem = ({
  title,
  artist,
  imageUrl,
  onClick,
}: {
  title: string;
  artist: string;
  imageUrl: string;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    style={{
      cursor: 'pointer',
      backgroundColor: '#333',
      borderRadius: '8px',
      padding: '10px',
      width: '150px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    }}
  >
    <img
      src={imageUrl}
      alt={title}
      style={{
        width: '100%',
        borderRadius: '8px',
        marginBottom: '10px',
        height: '100px',
        objectFit: 'cover',
      }}
    />
    <p>{title}</p>
    <p style={{ fontSize: '0.9rem', color: '#bbb' }}>{artist}</p>
  </div>
);

const ExploreNow: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn, signIn } = useAuth();

  // Manejo de navegación
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const handleNavigateToSettings = () => navigate('/settings');
  const handleNavigateToProfile = () => navigate('/profile');
  const handleNavigateToAccount = () => navigate('/account');

  // Iniciar sesión de prueba
  const handleLogin = () => {
    signIn('test@example.com', 'password123').then(() => {});
  };

  useEffect(() => {
    if (isSignedIn) {
      navigate('/profile');
    }
  }, [isSignedIn, navigate]);

  // Datos de las categorías
  const musicData = [
    { title: 'Song 1', artist: 'Artist 1', imageUrl: 'music-image.jpg', onClick: () => console.log('Song 1 clicked') },
    { title: 'Song 2', artist: 'Artist 2', imageUrl: 'music-image-2.jpg', onClick: () => console.log('Song 2 clicked') },
  ];

  const videoData = [
    { title: 'Video 1', artist: 'Artist 1', imageUrl: 'video-image.jpg', onClick: () => console.log('Video 1 clicked') },
    { title: 'Video 2', artist: 'Artist 2', imageUrl: 'video-image-2.jpg', onClick: () => console.log('Video 2 clicked') },
  ];

  const gamingData = [
    { title: 'Game 1', artist: 'Developer 1', imageUrl: 'game-image.jpg', onClick: () => console.log('Game 1 clicked') },
    { title: 'Game 2', artist: 'Developer 2', imageUrl: 'game-image-2.jpg', onClick: () => console.log('Game 2 clicked') },
  ];

  const educationData = [
    { title: 'Learn Blockchain', description: 'Introduction to Blockchain and its use cases', onClick: () => console.log('Learn Blockchain clicked') },
    { title: 'Crypto 101', description: 'Basic understanding of cryptocurrency and blockchain', onClick: () => console.log('Crypto 101 clicked') },
  ];

  // Componente común para las secciones de contenido
  const CategorySection = ({
    title,
    data,
    description,
  }: {
    title: string;
    data: any[];
    description?: string;
  }) => (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderLeft: `5px solid #3ecadd`,
      }}
    >
      <h4 style={{ color: '#407188' }}>{title}</h4>
      {description && <p style={{ color: '#8c8c9c' }}>{description}</p>}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'scroll',
          padding: '10px 0',
        }}
      >
        {data.map((item, index) => (
          <CategoryItem
            key={index}
            title={item.title}
            artist={item.artist || item.description} // Use 'description' for educational content
            imageUrl={item.imageUrl}
            onClick={item.onClick}
          />
        ))}
      </div>
      <ShareButton />
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        height: '100vh',
        backgroundColor: '#121212',
        color: '#fff',
      }}
    >
      {/* Contenido Principal */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          overflow: 'auto',
          backgroundColor: '#1d475f',
          flexGrow: 1,
        }}
      >
        {/* Sección de Categorías */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <CategorySection
            title="Explore Music"
            data={musicData}
          />
          <CategorySection
            title="Explore Videos"
            data={videoData}
          />
          <CategorySection
            title="Explore Gaming"
            data={gamingData}
          />
          <CategorySection
            title="Crypto Education"
            data={educationData}
            description="Learn how blockchain and crypto are revolutionizing the music, video, and gaming industries."
          />
        </div>
      </div>

      <BottomNavBar
        onNavigateToSettings={handleNavigateToSettings}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToAccount={handleNavigateToAccount}
        onLogout={handleLogout}
        onConnectWallet={() => console.log("Connecting wallet...")} // Implementación de la función
      />

      {/* Botón de Ingreso */}
      {!isSignedIn && (
        <button
          onClick={handleLogin}
          style={{ marginTop: '20px', backgroundColor: '#3ecadd', color: '#fff', padding: '10px', borderRadius: '5px' }}
        >
          Log In
        </button>
      )}
    </div>
  );
};

export default ExploreNow;
