//Este componente se encargará de mostrar los contenidos (música, videos, NFTs) en forma de cuadrícula.
import React from 'react';

interface ContentItem {
  id: string;
  title: string;
  creator: string;
  imageUrl: string;
}

interface ContentGridProps {
  contents: ContentItem[];
  onContentClick: (id: string) => void;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ contents, onContentClick }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {contents.map((content) => (
        <div
          key={content.id}
          className="bg-white shadow-md p-4 rounded cursor-pointer hover:shadow-lg"
          onClick={() => onContentClick(content.id)}
        >
          <img src={content.imageUrl} alt={content.title} className="w-full h-40 object-cover rounded" />
          <h3 className="mt-2 text-lg font-semibold">{content.title}</h3>
          <p className="text-sm text-gray-500">By {content.creator}</p>
        </div>
      ))}
    </div>
  );
};
