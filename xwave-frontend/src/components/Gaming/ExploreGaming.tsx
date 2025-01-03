import React, { useState } from 'react'; // Usamos PlayerContext para manejar el reproductor
import GameCard from '../../components/Gaming/GamingCard'; // Componente para la tarjeta de juego

const ExploreGaming: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);  // Para manejar el estado de carga del juego
  const { playerState, playContent, stopContent } = usePlayer();  // Usamos PlayerContext para manejar el estado del reproductor

  const gamingList = [
    { id: 1, title: 'Game 1', src: 'gameplay1.mp4', thumbnail: 'game1-thumbnail.jpg' },
    { id: 2, title: 'Game 2', src: 'gameplay2.mp4', thumbnail: 'game2-thumbnail.jpg' },
    // Más juegos pueden agregarse aquí...
  ];

  const playGameplay = (game: { title: string; src: string }) => {
    setIsLoading(true);
    console.log(`Reproduciendo Gameplay: ${game.title}`);
    // Llamamos al contexto del reproductor para iniciar el gameplay
    playContent(game.title, 'Game Developer', game.src, 'game');
    setIsLoading(false);
  };

  const stopGameplay = () => {
    stopContent();  // Detenemos el gameplay
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <h3 style={{ textAlign: 'center', color: '#3ecadd' }}>Explore Gaming</h3>
      
      {/* Lista de juegos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {gamingList.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            thumbnail={game.thumbnail}
            onClick={() => playGameplay(game)}  // Al hacer clic en la tarjeta, se reproduce el gameplay
          />
        ))}
      </div>

      {/* Reproductor de Gameplay */}
      {playerState.isPlaying && playerState.type === 'gaming' && (
        <div
          style={{
            backgroundColor: '#2483ad',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            color: 'white',
            marginTop: '30px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h4>Now Playing</h4>
          <img
            // Verificamos que playerState.cover sea una cadena válida
            src={playerState.cover && typeof playerState.cover === 'string' ? playerState.cover : 'default-cover.jpg'}
            alt="Now Playing Cover"
            style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }}
          />
          <p style={{ fontWeight: 'bold' }}>{playerState.title || 'Unknown Title'}</p>
          <p>{playerState.artist || 'Unknown Artist'}</p>

          {isLoading ? (
            <p style={{ color: '#8c8c9c' }}>Cargando...</p>
          ) : (
            <button
              onClick={stopGameplay}
              style={{
                backgroundColor: '#3ecadd',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Stop
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreGaming;
function usePlayer(): { playerState: any; playContent: any; stopContent: any; } {
  throw new Error('Function not implemented.');
}

