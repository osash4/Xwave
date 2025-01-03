// src/components/Music/MusicCard.tsx
import React from 'react';

interface MusicCardProps {
  title: string;
  artist: string;
  coverImage: string;
  onClick: () => void; // Función para manejar la acción al hacer clic (reproducir la canción)
}

const MusicCard: React.FC<MusicCardProps> = ({ title, artist, coverImage, onClick }) => {
  return (
    <div
      style={{
        backgroundColor: '#2a2a2a',
        padding: '15px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.3s',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <img
        src={coverImage}
        alt={title}
        style={{
          width: '150px',
          height: '150px',
          objectFit: 'cover',
          borderRadius: '10px',
          marginBottom: '15px',
        }}
      />
      <h4 style={{ color: '#fff', textAlign: 'center', fontSize: '16px' }}>{title}</h4>
      <p style={{ color: '#aaa', fontSize: '14px' }}>{artist}</p>
    </div>
  );
};

export default MusicCard;
