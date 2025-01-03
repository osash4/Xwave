import { validateAddress } from '../../utils/validation.js';
import { Blockchain } from '../blockchain/Blockchain.js';

// Definimos las interfaces para el contrato y los beneficiarios
interface Beneficiary {
  address: string;
  share: number;
}

interface PaymentRecord {
  contentId: string;
  totalAmount: number;
  distributions: Distribution[];
  timestamp: number;
}

interface Distribution {
  address: string;
  amount: number;
  timestamp: number;
}

export class RoyaltyContract {
  blockchain: Blockchain;
  royalties: Map<string, RoyaltyContractData>;
  beneficiaries: Map<string, Map<string, Beneficiary>>;
  paymentHistory: Map<string, PaymentRecord[]>;

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;
    this.royalties = new Map();
    this.beneficiaries = new Map();
    this.paymentHistory = new Map();
  }

  async createRoyaltyContract(contentId: string, beneficiaries: Beneficiary[]) {
    if (!Array.isArray(beneficiaries) || beneficiaries.length === 0) {
      throw new Error('Invalid beneficiaries');
    }

    const totalShare = beneficiaries.reduce((sum, b) => sum + b.share, 0);
    if (totalShare !== 100) {
      throw new Error('Total share must be 100%');
    }

    // Validate all beneficiary addresses
    beneficiaries.forEach(b => {
      if (!validateAddress(b.address)) {
        throw new Error(`Invalid address for beneficiary: ${b.address}`);
      }
    });

    const contract: RoyaltyContractData = {
      contentId,
      beneficiaries,
      createdAt: Date.now(),
      status: 'ACTIVE',
      totalEarnings: 0
    };

    this.royalties.set(contentId, contract);
    this.beneficiaries.set(contentId, new Map(
      beneficiaries.map(b => [b.address, b])
    ));

    return contract;
  }

  async distributeRoyalties(contentId: string, amount: number) {
    const contract = this.royalties.get(contentId);
    if (!contract || contract.status !== 'ACTIVE') {
      throw new Error('Invalid or inactive royalty contract');
    }

    const distributions: Distribution[] = [];
    for (const beneficiary of contract.beneficiaries) {
      const share = (amount * beneficiary.share) / 100;
      
      await this.blockchain.balancesPallet.transfer(
        this.blockchain.treasury,
        beneficiary.address,
        share
      );

      distributions.push({
        address: beneficiary.address,
        amount: share,
        timestamp: Date.now()
      });
    }

    // Record payment history
    const paymentRecord: PaymentRecord = {
      contentId,
      totalAmount: amount,
      distributions,
      timestamp: Date.now()
    };

    if (!this.paymentHistory.has(contentId)) {
      this.paymentHistory.set(contentId, []);
    }
    this.paymentHistory.get(contentId)?.push(paymentRecord);

    contract.totalEarnings += amount;
    return distributions;
  }

  getPaymentHistory(contentId: string) {
    return this.paymentHistory.get(contentId) || [];
  }

  getBeneficiaryEarnings(contentId: string, address: string) {
    const history = this.paymentHistory.get(contentId) || [];
    return history.reduce((total: number, payment: PaymentRecord) => {
      const distribution = payment.distributions.find(d => d.address === address);
      return total + (distribution ? distribution.amount : 0);
    }, 0);
  }
}

// Definimos el tipo de contrato de regalías
interface RoyaltyContractData {
  contentId: string;
  beneficiaries: Beneficiary[];
  createdAt: number;
  status: string;
  totalEarnings: number;
}
