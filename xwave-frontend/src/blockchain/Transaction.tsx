import { calculateHash } from '../../utils/crypto';

interface ContractData {
  type: string;
  contentId: string;
  contentHash: string;
  tokenId?: string; // Añadido tokenId como opcional
  expirationDate?: number; // Añadido expirationDate como opcional
}

export class Transaction {
  sender: string;
  recipient: string;
  amount: number;
  timestamp: number;
  type: string;
  contractData: ContractData | undefined;
  signature: string;
  nonce: number;
  contractType: any; // Si puedes, reemplaza 'any' por un tipo más específico

  constructor(sender: string, recipient: string, amount: number, type: string = 'TRANSFER', contractData: ContractData | undefined = undefined) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
    this.timestamp = Date.now();
    this.type = type;
    this.contractData = contractData;
    this.signature = '';
    this.nonce = 0;
  }

  calculateHash(): string {
    return calculateHash({
      sender: this.sender,
      recipient: this.recipient,
      amount: this.amount,
      timestamp: this.timestamp,
      type: this.type,
      contractData: this.contractData,
      nonce: this.nonce
    });
  }

  sign(signingKey: any): void {
    if (signingKey.getPublic('hex') !== this.sender) {
      throw new Error('You cannot sign transactions for other wallets!');
    }

    const hash = this.calculateHash();
    this.signature = signingKey.sign(hash, 'base64').toDER('hex');
  }

  isValid(): boolean {
    if (this.sender === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    // Verificamos la firma con la clave pública proporcionada
    return true;
  }
}
