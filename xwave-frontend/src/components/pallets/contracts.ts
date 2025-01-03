import { Blockchain } from '../../blockchain/Blockchain';  
import { Transaction } from '../../blockchain/Transaction'; 
import { validateAddress } from '../../../utils/validation';  // Asegúrate de tener la importación si la necesitas

interface RoyaltyContract {
  type: 'ROYALTY';
  contentId: string;
  creator: string;
  royaltyPercentage: number;
  createdAt: number;
}

interface LicenseContract {
  type: 'LICENSE';
  contentId: string;
  owner: string;
  licensee: string;
  duration: number;
  terms: string;
  createdAt: number;
  expiresAt: number;
}

export class ContractsPallet {
  private blockchain: Blockchain;
  private royalties: Map<string, RoyaltyContract>;
  private licenses: Map<string, LicenseContract>;

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;
    this.royalties = new Map();
    this.licenses = new Map();
  }

  // Crear un contrato de regalía
  async createRoyaltyContract(contentId: string, creator: string, royaltyPercentage: number): Promise<RoyaltyContract> {
    if (royaltyPercentage < 0 || royaltyPercentage > 100) {
      throw new Error('Invalid royalty percentage');
    }

    // Validar la dirección del creador
    if (!validateAddress(creator)) {
      throw new Error('Invalid creator address');
    }

    const contract: RoyaltyContract = {
      type: 'ROYALTY',
      contentId,
      creator,
      royaltyPercentage,
      createdAt: Date.now()
    };

    this.royalties.set(contentId, contract);
    return contract;
  }

  // Crear un contrato de licencia
  async createLicenseContract(contentId: string, owner: string, licensee: string, duration: number, terms: string): Promise<LicenseContract> {
    // Validar las direcciones del propietario y el licenciatario
    if (!validateAddress(owner) || !validateAddress(licensee)) {
      throw new Error('Invalid owner or licensee address');
    }

    const contract: LicenseContract = {
      type: 'LICENSE',
      contentId,
      owner,
      licensee,
      duration,
      terms,
      createdAt: Date.now(),
      expiresAt: Date.now() + duration
    };

    this.licenses.set(`${contentId}-${licensee}`, contract);
    return contract;
  }

  // Procesar el pago de regalías
  async processRoyaltyPayment(contentId: string, amount: number): Promise<number> {
    const contract = this.royalties.get(contentId);
    if (!contract) {
      throw new Error('No royalty contract found');
    }

    // Validar la dirección del creador antes de procesar el pago
    if (!validateAddress(contract.creator)) {
      throw new Error('Invalid creator address');
    }

    const royaltyAmount = amount * (contract.royaltyPercentage / 100);
    
    // Crear una transacción para registrar el pago de regalías
    const transaction = new Transaction(this.blockchain.treasury, contract.creator, royaltyAmount, 'ROYALTY_PAYMENT');
    await this.blockchain.addTransaction(transaction);

    // Transferir el pago de regalías
    await this.blockchain.balancesPallet.transfer(
      this.blockchain.treasury,
      contract.creator,
      royaltyAmount
    );

    return royaltyAmount;
  }

  // Validar si un contrato de licencia sigue siendo válido
  isLicenseValid(contentId: string, licensee: string): boolean {
    const license = this.licenses.get(`${contentId}-${licensee}`);
    if (!license) return false;

    return license.expiresAt > Date.now();
  }

  // Obtener contrato de regalía
  getRoyaltyContract(contentId: string): RoyaltyContract | undefined {
    return this.royalties.get(contentId);
  }

  // Obtener contrato de licencia
  getLicenseContract(contentId: string, licensee: string): LicenseContract | undefined {
    return this.licenses.get(`${contentId}-${licensee}`);
  }
}
