// Función para validar metadata de contenido
export const validateContentMetadata = (metadata: { 
  title: any; 
  description: any; 
  artist: any; 
  fileType: any; 
  fileSize: any; 
}) => {
  const { title, description, artist, fileType, fileSize } = metadata;

  if (!title || typeof title !== 'string' || title.length === 0) {
    throw new Error('Invalid title');
  }
  if (!description || typeof description !== 'string' || description.length === 0) {
    throw new Error('Invalid description');
  }
  if (!artist || typeof artist !== 'string' || artist.length === 0) {
    throw new Error('Invalid artist');
  }
  if (!fileType || !['audio', 'video', 'image'].includes(fileType)) {
    throw new Error('Invalid file type');
  }
  if (fileSize <= 0) {
    throw new Error('Invalid file size');
  }

  return true;
};

// Función para validar una dirección (por ejemplo, dirección IPFS o blockchain)
export const validateAddress = (address: string): boolean => {
  // Ejemplo básico de validación de direcciones (ajustar según tus necesidades)
  const regex = /^[a-zA-Z0-9]{46}$/; // Direcciones IPFS/Blockchain suelen tener 46 caracteres alfanuméricos
  if (!address || typeof address !== 'string' || !regex.test(address)) {
    throw new Error('Invalid address');
  }
  return true;
};

// Nueva función para validar una propuesta
export const validateProposal = (proposal: { type: string; data: any }) => {
  if (!proposal || typeof proposal !== 'object') {
    throw new Error('Invalid proposal');
  }

  if (!proposal.type || typeof proposal.type !== 'string') {
    throw new Error('Invalid proposal type');
  }

  if (!proposal.data || typeof proposal.data !== 'object') {
    throw new Error('Invalid proposal data');
  }

  // Aquí puedes agregar más validaciones según el tipo de propuesta, por ejemplo:
  if (proposal.type === 'PARAMETER_CHANGE' && !proposal.data.parameterName) {
    throw new Error('Invalid parameter change proposal');
  }

  // Si necesitas más validaciones específicas, agrégalas aquí.

  return true;
};
