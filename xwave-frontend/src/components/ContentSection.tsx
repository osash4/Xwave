import React from 'react';

interface ContentSectionProps {
  title: string;
  items: string[]; // Lista de ítems (por ejemplo, canciones o contenidos)
  onItemClick: (trackTitle: string) => void; // Función para manejar el click en un ítem
}

export const ContentSection: React.FC<ContentSectionProps> = ({ title, items, onItemClick }) => {
  return (
    <section className="content-section">
      <h2>{title}</h2>
      <div className="content-list">
        {items.map((item, index) => (
          <div key={index} className="content-item" onClick={() => onItemClick(item)}>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
