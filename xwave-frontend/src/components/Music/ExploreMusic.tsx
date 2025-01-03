import React, { useState, useContext } from 'react';
import MusicCard from '../../components/Music/MusicCard';  // Importar el nuevo MusicCard
import ShareButton from '../../components/ShareButton'; // Botón para compartir contenido


const ExploreMusic: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false); // Para manejar el estado de carga de la canción
  const { playerState, playContent, stopContent } = useContext(PlayerContext); // Usamos el PlayerContext para manejar el estado del reproductor

  const musicList = [
    { id: 1, title: 'Song 1', artist: 'Artist 1', src: 'song1.mp3', imageUrl: 'song1-image.jpg' },
    { id: 2, title: 'Song 2', artist: 'Artist 2', src: 'song2.mp3', imageUrl: 'song2-image.jpg' },
    // Más canciones pueden agregarse aquí...
  ];

  const playSong = (song: { title: string; artist: string; src: string }) => {
    setIsLoading(true);
    console.log(`Reproduciendo: ${song.title}`);
    // Llama a la función 'playContent' del contexto con los parámetros necesarios
    playContent(song.title, song.artist, song.src, 'audio');
    setIsLoading(false);
  };

  const stopSong = () => {
    stopContent();  // Detenemos la canción
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <h3 style={{ textAlign: 'center', color: '#3ecadd' }}>Explore Music</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {musicList.map((song) => (
          <MusicCard
            key={song.id}
            title={song.title}
            artist={song.artist}
            coverImage={song.imageUrl}
            onClick={() => playSong(song)} // Al hacer click, se ejecuta playSong
          />
        ))}
      </div>

      {/* Reproductor de música */}
      {playerState.isPlaying && (
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
            src={typeof playerState.cover === 'string' ? playerState.cover : 'default-cover.jpg'}
            alt="Now Playing Cover"
            style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }}
          />
          <p style={{ fontWeight: 'bold' }}>{playerState.title || 'Unknown Title'}</p>
          <p>{playerState.artist || 'Unknown Artist'}</p>

          {isLoading ? (
            <p style={{ color: '#8c8c9c' }}>Cargando...</p>
          ) : (
            <button
              onClick={stopSong}
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

      {/* Botón para compartir */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <ShareButton />
      </div>
    </div>
  );
};

export default ExploreMusic;
