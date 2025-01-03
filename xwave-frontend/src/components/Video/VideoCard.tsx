// src/components/Video/VideoCard.tsx
import React from 'react';

interface VideoCardProps {
  title: string;
  thumbnail: string;
  onClick: () => void; // Función para manejar el click y reproducir el video
}

const VideoCard: React.FC<VideoCardProps> = ({ title, thumbnail, onClick }) => {
  return (
    <div
      style={{
        backgroundColor: '#1e1e1e',
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
        src={thumbnail}
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
    </div>
  );
};

export default VideoCard;
