// src/components/artist/ContentUploader.tsx
import React, { useState } from 'react';

const ContentUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Por favor selecciona un archivo');
      return;
    }
    
    setUploading(true);
    setMessage('');

    // Aquí iría el código para subir el archivo al backend, como una solicitud a tu API.
    try {
      // Simulación de subida
      setTimeout(() => {
        setMessage('Archivo cargado exitosamente');
        setUploading(false);
      }, 2000); // Simula una subida de 2 segundos
    } catch (error) {
      setMessage('Error al cargar el archivo');
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Sube tu contenido</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Subiendo...' : 'Subir archivo'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export { ContentUploader };
