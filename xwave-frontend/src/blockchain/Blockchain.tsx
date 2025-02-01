import * as crypto from 'crypto';
import { Transaction } from './Transaction'

// Clase Block
class Block {
    public hash: string;

    constructor(
        public timestamp: Date,
        public transactions: Transaction[],
        public previousHash: string = '',
        public nonce: number = 0
    ) {
        this.hash = this.calculateHash();
    }

    calculateHash(): string {
        return crypto
            .createHash('sha256')
            .update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce)
            .digest('hex');
    }

    mineBlock(difficulty: number): void {
        while (!this.hash.startsWith('0'.repeat(difficulty))) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Bloque minado: ${this.hash}`);
    }
}

// Clase Blockchain
class Blockchain {
    getAccount(): string | PromiseLike<string | null> | null {
      throw new Error('Method not implemented.');
    }
    on(arg0: string, handleDisconnect: () => void) {
      throw new Error('Method not implemented.');
    }
    off(arg0: string, handleDisconnect: () => void) {
      throw new Error('Method not implemented.');
    }
    private chain: Block[] = [this.createGenesisBlock()];
  nftPallet: any;

    private createGenesisBlock(): Block {
        return new Block(new Date(), [], '0');
    }

    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock: Block, difficulty: number): void {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(): boolean {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.error('Hash del bloque actual no coincide.');
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.error('Hash del bloque anterior no coincide.');
                return false;
            }

            for (const transaction of currentBlock.transactions) {
                if (!transaction.isValid()) {
                    console.error('Transacción inválida detectada en el bloque.');
                    return false;
                }
            }
        }
        return true;
    }

    getAccountBalance(address: string): number {
        let balance = 0;
        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.sender === address) {
                    balance -= transaction.amount;
                }
                if (transaction.recipient === address) {
                    balance += transaction.amount;
                }
            }
        }
        return balance;
    }

    async connect(): Promise<void> {
        console.log('Connecting to the blockchain...');
    }

    getAccounts(): string[] {
        const accounts: Set<string> = new Set();
        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                accounts.add(transaction.sender);
                accounts.add(transaction.recipient);
            }
        }
        return Array.from(accounts);
    }

    addTransaction(transaction: Transaction): void {
        if (!transaction.isValid()) {
            throw new Error('Invalid Transaction');
        }
        const latestBlock = this.getLatestBlock();
        latestBlock.transactions.push(transaction);
    }
}

// Clase Validator
class Validator {
    constructor(public address: string, public stake: number, public isActive: boolean = true) {}
}

// Clase ProofOfStake
class ProofOfStake {
    private validators: Validator[] = [];

    addValidator(address: string, stake: number): void {
        if (stake <= 0) {
            throw new Error('El stake debe ser mayor a cero.');
        }
        this.validators.push(new Validator(address, stake));
    }

    selectValidator(): Validator {
        const totalStake = this.validators.reduce((sum, v) => sum + (v.isActive ? v.stake : 0), 0);
        const random = Math.random() * totalStake;

        let cumulative = 0;
        for (const validator of this.validators) {
            if (!validator.isActive) continue;
            cumulative += validator.stake;
            if (random <= cumulative) {
                return validator;
            }
        }

        throw new Error('No se pudo seleccionar un validador.');
    }

    slashValidator(address: string): void {
        const validator = this.validators.find(v => v.address === address);
        if (validator) {
            validator.isActive = false;
            console.log(`Validador ${address} penalizado.`);
        } else {
            console.error('No se encontró al validador para penalizar.');
        }
    }
}

// Instanciación de la clase Blockchain
const blockchain = new Blockchain();

// Llamar al método connect
(async () => {
    await blockchain.connect();
    console.log('Blockchain conectada.');
})();

// Exportación de las clases principales
export { Blockchain, Transaction, Block, ProofOfStake };
