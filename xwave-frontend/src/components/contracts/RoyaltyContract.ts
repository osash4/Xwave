import { validateAddress } from '../../../utils/validation';  // Asumo que validation.ts es un archivo .ts o .js

interface Beneficiary {
  address: string;
  share: number;
}

interface Distribution {
  address: string;
  amount: number;
  timestamp: number;
}

interface PaymentRecord {
  contentId: string;
  totalAmount: number;
  distributions: Distribution[];
  timestamp: number;
}

interface RoyaltyContractData {
  contentId: string;
  beneficiaries: Beneficiary[];
  createdAt: number;
  status: 'ACTIVE' | 'INACTIVE';
  totalEarnings: number;
}

export class RoyaltyContract {
  private blockchain: any;  // Se debe reemplazar `any` con el tipo adecuado para la blockchain
  private royalties: Map<string, RoyaltyContractData>;
  private beneficiaries: Map<string, Map<string, Beneficiary>>; // contentId -> address -> Beneficiary
  private paymentHistory: Map<string, PaymentRecord[]>; // contentId -> PaymentRecord[]

  constructor(blockchain: any) {
    this.blockchain = blockchain;
    this.royalties = new Map();
    this.beneficiaries = new Map();
    this.paymentHistory = new Map();
  }

  // Crea un contrato de regalías
  async createRoyaltyContract(contentId: string, beneficiaries: Beneficiary[]): Promise<RoyaltyContractData> {
    if (!Array.isArray(beneficiaries) || beneficiaries.length === 0) {
      throw new Error('Invalid beneficiaries');
    }

    const totalShare = beneficiaries.reduce((sum, b) => sum + b.share, 0);
    if (totalShare !== 100) {
      throw new Error('Total share must be 100%');
    }

    // Validar todas las direcciones de los beneficiarios
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

  // Distribuye las regalías entre los beneficiarios
  async distributeRoyalties(contentId: string, amount: number): Promise<Distribution[]> {
    const contract = this.royalties.get(contentId);
    if (!contract || contract.status !== 'ACTIVE') {
      throw new Error('Invalid or inactive royalty contract');
    }

    const distributions: Distribution[] = [];
    
    // Iterar sobre el arreglo de beneficiarios
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

    // Registrar el historial de pagos
    const paymentRecord: PaymentRecord = {
      contentId,
      totalAmount: amount,
      distributions,
      timestamp: Date.now()
    };

    if (!this.paymentHistory.has(contentId)) {
      this.paymentHistory.set(contentId, []);
    }
    this.paymentHistory.get(contentId)!.push(paymentRecord);

    contract.totalEarnings += amount;
    return distributions;
  }

  // Obtiene el historial de pagos de un contenido
  getPaymentHistory(contentId: string): PaymentRecord[] {
    return this.paymentHistory.get(contentId) || [];
  }

  // Obtiene las ganancias de un beneficiario específico
  getBeneficiaryEarnings(contentId: string, address: string): number {
    const history = this.paymentHistory.get(contentId) || [];
    return history.reduce((total, payment) => {
      const distribution = payment.distributions.find(d => d.address === address);
      return total + (distribution ? distribution.amount : 0);
    }, 0);
  }
}
