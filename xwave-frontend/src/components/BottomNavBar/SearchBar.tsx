import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FolderArchiveIcon } from 'lucide-react';

interface SearchBarProps {
  value: string;           // Propiedad para manejar el valor de la búsqueda
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Función para manejar cambios en el input
  onSearch: (query: string) => void; // Función de búsqueda
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  const navigate = useNavigate();

  // Función que maneja el envío de la búsqueda
  const handleSearch = async () => {
    if (value) {
      onSearch(value);  // Ejecutar la función de búsqueda pasada como prop
      navigate(`/search?q=${value}`);  // Navegar a la página de búsqueda con el query
    }
  };

  return (
    <div className="search-bar bg-[#1d475f] text-white p-2 flex items-center justify-between rounded-full w-full max-w-4xl mx-auto">
      {/* Botón de Explore (Browse) a la izquierda */}
      <button
        onClick={() => navigate('/browse')}  // Redirige a la página de exploración
        className="button-explore bg-[#3ecadd] text-white p-3 rounded-full hover:bg-[#31b2bb] transition-colors duration-300 mr-2"
      >
        <FolderArchiveIcon size={24} />
      </button>

      {/* Contenedor con estilo relative para poder posicionar el botón de búsqueda dentro */}
      <div className="relative flex items-center w-full">
        {/* Campo de búsqueda */}
        <input
          type="text"
          placeholder="What are you in the mood for?"
          value={value} // Usamos el valor pasado como prop
          onChange={onChange} // Llamamos la función onChange pasada como prop
          className="search-input w-full p-3 pl-10 pr-10 rounded-full bg-[#2c3e50] text-white placeholder-white"  // Agregar padding para el ícono
        />

        {/* Botón de búsqueda dentro del campo, al lado del texto */}
        <button
          onClick={handleSearch}
          className="search-button absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#3ecadd] text-white p-3 rounded-full hover:bg-[#31b2bb] transition-colors duration-300"
        >
          <Search size={24} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
