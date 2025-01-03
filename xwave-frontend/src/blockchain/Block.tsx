import { calculateHash } from '../../utils/crypto';

interface Transaction {
  // Define el tipo de los objetos transacción según tus necesidades
  [key: string]: any;
}

export class Block {
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  validator: string;
  hash: string;
  height: number;

  constructor(timestamp: number, transactions: Transaction[], previousHash: string = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.validator = '';
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    return calculateHash({
      previousHash: this.previousHash,
      timestamp: this.timestamp,
      transactions: this.transactions,
      validator: this.validator
    });
  }
}
