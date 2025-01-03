// src/components/Education/ExploreEducation.tsx
import React, { useState } from 'react';
import EducationCard from '../../components/Education/EducationCard'; // Componente de la tarjeta de educación

const ExploreEducation: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false); // Estado para saber si un video está reproduciéndose
  const [currentVideo, setCurrentVideo] = useState<{ title: string; src: string; creator: string } | null>(null); // Para guardar el video actual
  const [isLoading, setIsLoading] = useState(false); // Para manejar la carga del contenido educativo

  const educationList = [
    { id: '1', title: 'Qué es la Blockchain', src: 'blockchain-edu.mp4', creator: 'EduTech', thumbnail: 'blockchain-thumbnail.jpg' },
    { id: '2', title: 'NFTs y Música', src: 'nft-music.mp4', creator: 'Crypto Academy', thumbnail: 'nft-music-thumbnail.jpg' },
    // más recursos educativos...
  ];

  const playEducationVideo = (edu: { title: string; src: string; creator: string }) => {
    setIsLoading(true);
    setCurrentVideo(edu);
    setIsPlaying(true);
    console.log(`Reproduciendo recurso educativo: ${edu.title}`);
    setIsLoading(false);
  };

  const stopEducationVideo = () => {
    setIsPlaying(false); // Detenemos el video educativo
    setCurrentVideo(null); // Limpiamos el video actual
    setIsLoading(false);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <h3 style={{ textAlign: 'center', color: '#3ecadd' }}>Crypto Education</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {educationList.map((eduItem) => (
          <EducationCard
            key={eduItem.id}
            title={eduItem.title}
            thumbnail={eduItem.thumbnail || 'default-thumbnail.jpg'}  // Aseguramos que thumbnail sea un string válido
            onClick={() => playEducationVideo(eduItem)}  // Al hacer clic en la tarjeta, se reproduce el video educativo
          />
        ))}
      </div>

      {/* Reproductor de Educación */}
      {isPlaying && currentVideo && (
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
            src={'default-cover.jpg'} // No tenemos imagen asociada en este momento, podemos poner una imagen por defecto
            alt="Now Playing Cover"
            style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }}
          />
          <p style={{ fontWeight: 'bold' }}>{currentVideo.title}</p>
          <p>{currentVideo.creator}</p>

          {isLoading ? (
            <p style={{ color: '#8c8c9c' }}>Cargando...</p>
          ) : (
            <button
              onClick={stopEducationVideo}
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

export default ExploreEducation;
