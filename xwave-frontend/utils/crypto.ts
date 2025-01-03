import CryptoJS from 'crypto-js';
import { createHash } from 'crypto-browserify';
import EC from 'elliptic';

// Usamos la curva secp256k1 para las claves
export const ec = new EC.ec('secp256k1');

// Define los tipos para el retorno de la función generateKeyPair
export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

// Calcula el hash de los datos proporcionados
export const calculateHash = (data: any): string => {
  const hash1 = CryptoJS.SHA256(JSON.stringify(data)); // Se usa SHA256 de CryptoJS
  const hash2 = createHash('sha256').update(hash1.toString()).digest('hex'); // Doble SHA256
  return hash2;
};

// Genera un nuevo par de claves
export const generateKeyPair = (): KeyPair => {
  const keyPair = ec.genKeyPair(); // Generación de claves con la librería elliptic
  return {
    privateKey: keyPair.getPrivate('hex'),
    publicKey: keyPair.getPublic('hex')
  };
};
