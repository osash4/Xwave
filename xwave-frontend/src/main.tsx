import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // La extensión .tsx puede omitirse
import './index.css';

// Importar Buffer y hacerlo global
import { Buffer } from 'buffer';

if (!window.Buffer) {
  window.Buffer = Buffer; // Hacer que Buffer esté disponible globalmente
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error('No se encontró el contenedor #root');
}
