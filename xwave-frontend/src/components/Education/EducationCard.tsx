// src/components/Education/EducationCard.tsx
import React from 'react';


interface EducationCardProps {
  title: string;
  thumbnail: string; // Usaremos un thumbnail para representar el recurso educativo
  onClick: () => void; // Función para manejar la acción de clic
}

const EducationCard: React.FC<EducationCardProps> = ({ title, thumbnail, onClick }) => {
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
        maxWidth: '200px',
        textAlign: 'center',
        marginBottom: '20px',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Imagen de miniatura o icono representativo del recurso educativo */}
      <img
        src={thumbnail || 'default-thumbnail.jpg'}  // Aseguramos que src no sea undefined
        alt={title}
        style={{
          width: '150px',
          height: '150px',
          objectFit: 'cover',
          borderRadius: '10px',
          marginBottom: '15px',
        }}
      />
      {/* Título del recurso educativo */}
      <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '10px', fontWeight: 'bold' }}>
        {title}
      </h4>

      {/* Agregamos un pequeño pie de texto que puede decir algo sobre el contenido */}
      <p style={{ color: '#aaa', fontSize: '14px' }}>Aprende sobre temas de Crypto y Blockchain</p>
    </div>
  );
};

export default EducationCard;
