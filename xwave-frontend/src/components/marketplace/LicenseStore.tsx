//Este componente mostrará las opciones de licencias disponibles para el contenido.

import React from 'react';

interface License {
  id: string;
  type: string;
  price: string;
  description: string;
}

interface LicenseStoreProps {
  licenses: License[];
  onPurchase: (id: string) => void;
}

export const LicenseStore: React.FC<LicenseStoreProps> = ({ licenses, onPurchase }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Licenses</h2>
      <ul className="space-y-4">
        {licenses.map((license) => (
          <li
            key={license.id}
            className="border p-4 rounded shadow-sm hover:shadow-md"
          >
            <h3 className="text-lg font-semibold">{license.type}</h3>
            <p className="text-sm text-gray-500">{license.description}</p>
            <p className="mt-2 text-md font-bold">${license.price}</p>
            <button
              onClick={() => onPurchase(license.id)}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Purchase License
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
