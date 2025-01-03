interface ContractData {
  contentId?: string;
  amount?: number;
  creator?: string;
  licensee?: string;
  duration?: number;
  metadata?: string;
  tokenId?: string;
  expirationDate?: number;
  type?: string; // Agregado para poder utilizar el tipo
  contentHashes?: string[]; // Agregado para contenido hash, si es necesario
  [key: string]: any; // Permite otras propiedades adicionales si las hubiera
}

export class Blockchain {
  [x: string]: any;
  chain: Block[];
  difficulty: number;
  pendingTransactions: Transaction[];
  validators: Map<string, number>;
  minimumStake: number;
  penalizedValidators: Map<string, number>;
  lastValidatorTimestamps: Map<string, number>;
  doubleSigningProofs: Map<string, { height: number; hash: string }[]>;
  slashingPenalty: number;


  // Método connect (agregado)
  async connect() {
    try {
      // Aquí puedes agregar la lógica de conexión a tu red o API blockchain.
      console.log("Conectando a la blockchain...");
      // Simulando una conexión exitosa.
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación de espera por la conexión.
      console.log("Conexión exitosa a la blockchain");
    } catch (error) {
      console.error("Error al conectar a la blockchain:", error);
    }
  }

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.validators = new Map();
    this.minimumStake = 1000;
    this.penalizedValidators = new Map();
    this.lastValidatorTimestamps = new Map();
    this.doubleSigningProofs = new Map();
    this.slashingPenalty = 0.5;
  }

  createGenesisBlock() {
    return new Block(Date.now(), [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addValidator(address: string, stake: number): boolean {
    if (stake >= this.minimumStake) {
      const penaltyEndTime = this.penalizedValidators.get(address);
      if (penaltyEndTime && penaltyEndTime > Date.now()) {
        return false;
      }

      this.validators.set(address, stake);
      this.lastValidatorTimestamps.set(address, 0);
      return true;
    }
    return false;
  }

  selectValidator(): string | null {
    const currentTime = Date.now();
    const validValidators = Array.from(this.validators.entries()).filter(([address, _]) => {
      const penaltyEndTime = this.penalizedValidators.get(address);
      const lastValidationTime = this.lastValidatorTimestamps.get(address);

      return (!penaltyEndTime || penaltyEndTime < currentTime) &&
             (!lastValidationTime || (currentTime - lastValidationTime) > 300000);
    });

    if (validValidators.length === 0) return null;

    const totalStake = validValidators.reduce((sum, [_, stake]) => sum + stake, 0);
    let randomPoint = Math.random() * totalStake;

    for (const [address, stake] of validValidators) {
      randomPoint -= stake;
      if (randomPoint <= 0) {
        return address;
      }
    }

    return validValidators[0][0];
  }

  async minePendingTransactions(validatorAddress: string) {
    if (!this.validators.has(validatorAddress)) {
      throw new Error('Not a valid validator');
    }

    const blockHeight = this.chain.length;
    const validatorBlocks = this.doubleSigningProofs.get(validatorAddress) || [];
    if (validatorBlocks.some(b => b.height === blockHeight)) {
      this.slashValidator(validatorAddress);
      throw new Error('Double signing detected');
    }

    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    block.validator = validatorAddress;
    block.height = blockHeight;
    block.hash = block.calculateHash();

    this.lastValidatorTimestamps.set(validatorAddress, Date.now());

    const validatorProofs = this.doubleSigningProofs.get(validatorAddress);
    if (validatorProofs) {
      validatorProofs.push({
        height: blockHeight,
        hash: block.hash
      });
    } else {
      this.doubleSigningProofs.set(validatorAddress, [{
        height: blockHeight,
        hash: block.hash
      }]);
    }

    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction("", validatorAddress, this.calculateValidatorReward(validatorAddress), 'REWARD')
    ];
  }

  slashValidator(address: string) {
    const stake = this.validators.get(address);
    if (stake !== undefined) {
      const penalty = stake * this.slashingPenalty;
      this.validators.set(address, stake - penalty);
      this.penalizedValidators.set(address, Date.now() + 86400000); // Penalización de 24 horas
    }
  }

  calculateValidatorReward(validatorAddress: string): number {
    const stake = this.validators.get(validatorAddress);
    if (stake !== undefined) {
      return 1 + (stake / this.minimumStake) * 0.5;
    }
    console.warn(`El validador ${validatorAddress} no tiene un stake definido.`);
    return 0;
  }

  async executeSmartContract(transaction: Transaction) {
    if (transaction.contractData) {
      const contractData = transaction.contractData;

      switch (transaction.type) {
        case 'ROYALTY_PAYMENT':
          await this.processRoyaltyPayment(contractData);
          break;
        case 'CONTENT_LICENSE':
          await this.processContentLicense(contractData);
          break;
        case 'NFT_MINT':
          await this.processNFTMint(contractData);
          break;
      }
    }
  }

  async processRoyaltyPayment(contractData: ContractData) {
    if (contractData.creator && contractData.amount) {
      const royaltyTx = new Transaction("", contractData.creator, contractData.amount, 'ROYALTY');
      this.pendingTransactions.push(royaltyTx);
    }
  }

  async processContentLicense(contractData: ContractData) {
    if (contractData.contentId && contractData.licensee && contractData.duration) {
      const licenseTx = new Transaction(
        "", 
        contractData.licensee,
        0,
        'LICENSE',
        {
          contentId: contractData.contentId,
          expirationDate: Date.now() + contractData.duration
        }
      );
      this.pendingTransactions.push(licenseTx);
    }
  }

  async processNFTMint(contractData: ContractData) {
    if (contractData.contentId && contractData.owner && contractData.metadata) {
      const nftTx = new Transaction(
        "", 
        contractData.owner,
        0,
        'NFT_MINT',
        {
          contentId: contractData.contentId,
          tokenId: calculateHash(contractData.metadata + Date.now()),
          metadata: contractData.metadata
        }
      );
      this.pendingTransactions.push(nftTx);
    }
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      if (!currentBlock.transactions.every(tx => tx.isValid())) {
        return false;
      }

      if (!this.validators.has(currentBlock.validator)) {
        return false;
      }
    }
    return true;
  }

  addTransaction(transaction: Transaction): void {
    if (transaction.isValid()) {
      this.pendingTransactions.push(transaction);
    } else {
      console.error('Transacción inválida');
    }
  }
}

class Block {
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  height: number;
  validator: string;

  constructor(timestamp: number, transactions: Transaction[], previousHash: string) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.height = 0; // Se asignará el valor adecuado cuando se mine
    this.validator = ''; // Se asignará el validador cuando se mine
  }

  calculateHash(): string {
    return calculateHash(this.timestamp + JSON.stringify(this.transactions) + this.previousHash);
  }
}

class Transaction {
  sender: string;
  recipient: string;
  amount: number;
  type: string;
  contractData?: ContractData;

  constructor(sender: string, recipient: string, amount: number, type: string, contractData?: ContractData) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
    this.type = type;
    this.contractData = contractData;
  }

  isValid(): boolean {
    // Lógica de validación de transacción (ej., comprobación de firma)
    return true; // En este caso es solo un placeholder
  }
}

function calculateHash(data: string): string {
  // Función simple para simular el cálculo de un hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Aseguramos que el hash sea un número de 32 bits
  }
  return hash.toString(16);
}

// Instanciando y utilizando la clase Blockchain para operaciones
const blockchain = new Blockchain();

// Agregar un validador con una cantidad de stake (por ejemplo, 1000)
blockchain.addValidator("validator1", 1000);

// Agregar transacciones para el procesamiento
blockchain.addTransaction(new Transaction("sender", "recipient", 100, "ROYALTY_PAYMENT"));

// Simular la minería de transacciones
blockchain.minePendingTransactions("validator1");

// Verificar si la cadena es válida
console.log("¿Es válida la cadena?", blockchain.isChainValid());

// Mostrar el bloque más reciente
console.log("Último bloque:", blockchain.getLatestBlock());
