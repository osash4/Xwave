import React, { useState } from 'react';
import VideoCard from '../../components/Video/VideoCard'; // Componente para la tarjeta de video

const ExploreVideos: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);  // Para manejar el estado de carga del video
  const { playerState, playContent, stopContent } = usePlayer();  // Usamos PlayerContext para manejar el estado del reproductor

  const videoList = [
    { id: 1, title: 'Video 1', thumbnail: 'video1.jpg', src: 'video1.mp4' },
    { id: 2, title: 'Video 2', thumbnail: 'video2.jpg', src: 'video2.mp4' },
    // Más videos pueden agregarse aquí...
  ];

  const playVideo = (video: { title: string; src: string }) => {
    setIsLoading(true);
    console.log(`Reproduciendo Video: ${video.title}`);
    // Llamamos al contexto del reproductor para iniciar el video
    playContent(video.title, 'Artist Unknown', video.src, 'video');
    setIsLoading(false);
  };

  const stopVideo = () => {
    stopContent();  // Detenemos el video
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <h3 style={{ textAlign: 'center', color: '#3ecadd' }}>Explore Videos</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {videoList.map((video) => (
          <VideoCard
            key={video.id}
            title={video.title}
            thumbnail={video.thumbnail}
            onClick={() => playVideo(video)}  // Al hacer clic en la tarjeta, se reproduce el video
          />
        ))}
      </div>

      {/* Reproductor de Video */}
      {playerState.isPlaying && playerState.type === 'video' && (
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
            // Verificamos que playerState.cover sea una cadena o undefined, no un booleano
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
              onClick={stopVideo}
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

export default ExploreVideos;
function usePlayer(): { playerState: any; playContent: any; stopContent: any; } {
  throw new Error('Function not implemented.');
}

