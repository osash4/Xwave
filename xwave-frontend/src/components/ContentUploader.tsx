import { useState } from 'react';
import { validateContentMetadata } from '../../utils/validation'; // Importar validación de metadata
import { uploadToIPFS } from '../../storage/ipfs'; // Importar función para cargar a IPFS

const ContentUploader = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [artist, setArtist] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ipfsUrl, setIpfsUrl] = useState('');

  // Manejo de la carga del archivo
  const handleFileChange = (event: { target: { files: any[]; }; }) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileType(selectedFile.type);
    setFileSize(selectedFile.size);
  };

  const handleSubmit = async () => {
    // Validar metadata antes de cargar el archivo
    try {
      const metadata = {
        title,
        description,
        artist,
        fileType,
        fileSize,
      };

      // Validamos metadata
      validateContentMetadata(metadata);

      if (!file) {
        alert('Please select a file');
        return;
      }

      setLoading(true);

      // Subir archivo a IPFS
      const fileUrl = await uploadToIPFS(file);

      setIpfsUrl(fileUrl);
      setLoading(false);

      // Aquí puedes hacer lo siguiente:
      // - Guardar la URL de IPFS en la blockchain (transacción)
      // - Mostrar un mensaje de éxito

      alert('Content uploaded successfully!');
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Upload Your Content</h2>
      <form>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
        />
        <input type="file" onChange={handleFileChange} />
        <button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Content'}
        </button>
      </form>

      {ipfsUrl && (
        <div>
          <h3>Content Uploaded!</h3>
          <p>IPFS URL: <a href={ipfsUrl} target="_blank" rel="noopener noreferrer">{ipfsUrl}</a></p>
        </div>
      )}
    </div>
  );
};

export default ContentUploader;
