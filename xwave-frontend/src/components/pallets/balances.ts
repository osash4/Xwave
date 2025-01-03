import { Blockchain } from '../../blockchain/Blockchain';  
import { Transaction } from '../../blockchain/Transaction';  
import { validateAddress } from '../../../utils/validation';  

export class BalancesPallet {
  private blockchain: Blockchain;
  private balances: Map<string, number>;
  private minimumBalance: number;

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;
    this.balances = new Map<string, number>();
    this.minimumBalance = 1; // Por ejemplo, 1 es el mínimo para transferir
  }

  // Método para transferir
  async transfer(sender: string, recipient: string, amount: number): Promise<Transaction> {
    if (!validateAddress(sender) || !validateAddress(recipient)) {
      throw new Error('Invalid address');
    }

    const senderBalance = this.getBalance(sender);
    if (senderBalance < amount + this.minimumBalance) {
      throw new Error('Insufficient balance');
    }

    // Creamos la transacción
    const transaction = new Transaction(sender, recipient, amount, 'TRANSFER');
    this.blockchain.addTransaction(transaction);

    // Actualizamos los balances
    this.updateBalance(sender, -amount);
    this.updateBalance(recipient, amount);

    return transaction;
  }

  // Método para obtener el balance
  getBalance(address: string): number {
    return this.balances.get(address) || 0;
  }

  // Método para actualizar el balance
  updateBalance(address: string, amount: number): void {
    const currentBalance = this.getBalance(address);
    this.balances.set(address, currentBalance + amount);
  }

  // Método para acuñar nuevos tokens
  async mintTokens(address: string, amount: number): Promise<Transaction> {
    if (!this.blockchain.isValidator(address)) {
      throw new Error('Only validators can mint tokens');
    }

   
    const sender = '';  // El sender debe ser una cadena vacía o un valor predeterminado

    // Creamos la transacción de acuñación
    const transaction = new Transaction(sender, address, amount, 'MINT');
    this.blockchain.addTransaction(transaction);

    // Actualizamos el balance
    this.updateBalance(address, amount);

    return transaction;
  }
}
