import React from 'react';

export function FilterPanel({ filters, onChange, options }) {
  const handleFilterChange = (key, value) => {
    onChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Filters</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(options).map(([key, values]) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <select
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {values.map((value) => (
                <option key={value} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}