import React from 'react';

interface FilterOption {
  type: string;
  dateRange: string;
  amount: string;
}

interface FilterPanelProps {
  options: {
    type: string[];
    dateRange: string[];
    amount: string[];
  };
  selectedFilters: FilterOption;  // Ahora es un objeto FilterOption, no un array de strings
  onFilterSelect: (newFilterOption: FilterOption) => void;  // Función que maneja la actualización del filtro
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ options, selectedFilters, onFilterSelect }) => {
  // Maneja los cambios en los checkboxes
  const handleCheckboxChange = (category: keyof FilterOption, value: string) => {
    // Actualiza el estado de los filtros de acuerdo con la categoría
    onFilterSelect({
      ...selectedFilters,
      [category]: selectedFilters[category] === value ? 'all' : value,  // Alterna entre 'all' y el valor seleccionado
    });
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold">Filters</h3>

      {/* Filtrar por tipo */}
      <div>
        <h4 className="text-md font-semibold">Type</h4>
        {options.type.map((value) => (
          <div key={value}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFilters.type === value} // Marcar el checkbox si está seleccionado
                onChange={() => handleCheckboxChange('type', value)} // Llamar a la función de cambio de checkbox
                className="form-checkbox"
              />
              <span>{value}</span>
            </label>
          </div>
        ))}
      </div>

      {/* Filtrar por rango de fecha */}
      <div>
        <h4 className="text-md font-semibold">Date Range</h4>
        {options.dateRange.map((value) => (
          <div key={value}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFilters.dateRange === value} // Marcar el checkbox si está seleccionado
                onChange={() => handleCheckboxChange('dateRange', value)} // Llamar a la función de cambio de checkbox
                className="form-checkbox"
              />
              <span>{value}</span>
            </label>
          </div>
        ))}
      </div>

      {/* Filtrar por cantidad */}
      <div>
        <h4 className="text-md font-semibold">Amount</h4>
        {options.amount.map((value) => (
          <div key={value}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFilters.amount === value} // Marcar el checkbox si está seleccionado
                onChange={() => handleCheckboxChange('amount', value)} // Llamar a la función de cambio de checkbox
                className="form-checkbox"
              />
              <span>{value}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
