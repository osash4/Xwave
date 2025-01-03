import React from 'react';

interface GameCardProps {
  title: string;             // Título del juego
  thumbnail: string;         // Miniatura del juego
  onClick: () => void;       // Función para manejar el clic (reproducir el gameplay)
}

const GameCard: React.FC<GameCardProps> = ({ title, thumbnail, onClick }) => {
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
        width: '200px',  // Ajusta el tamaño según el diseño deseado
        margin: '10px',   // Espaciado entre tarjetas
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';  // Efecto de hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Imagen de la miniatura */}
      <img
        src={thumbnail}
        alt={title}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover',
          borderRadius: '10px',
          marginBottom: '15px',
        }}
      />
      {/* Título del juego */}
      <h4 style={{ color: '#fff', textAlign: 'center', fontSize: '16px', margin: 0 }}>
        {title}
      </h4>
    </div>
  );
};

export default GameCard;
