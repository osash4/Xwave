import { EventEmitter } from 'events';
import { validateProposal } from '../../../utils/validation';

// Definición de interfaces para las propuestas y votaciones
interface ProposalVotes {
  yes: number;
  no: number;
}

interface ProposalData {
  id: string;
  proposer: string;
  content: Proposal;  // Aquí utilizamos el tipo Proposal
  status: 'ACTIVE' | 'APPROVED' | 'REJECTED';
  startTime: number;
  endTime: number;
  votes: ProposalVotes;
}

// Definición del tipo Proposal
interface Proposal {
  type: 'PARAMETER_CHANGE' | 'UPGRADE' | 'EMERGENCY';
  data: any;  // Aquí podrías especificar más detalles sobre lo que contendrá `data` para cada tipo de propuesta
}

interface Blockchain {
  stakingPallet: {
    getStake: (voter: string) => number | undefined;
  };
}

export class DemocracyPallet extends EventEmitter {
  private blockchain: Blockchain;
  private proposals: Map<string, ProposalData>;
  private votes: Map<string, boolean>;
  private activeProposals: Set<string>;
  private proposalDuration: number;

  constructor(blockchain: Blockchain) {
    super();
    this.blockchain = blockchain;
    this.proposals = new Map();
    this.votes = new Map();
    this.activeProposals = new Set();
    this.proposalDuration = 7 * 24 * 60 * 60 * 1000; // 1 week
  }

  // Método para someter una propuesta
  async submitProposal(proposer: string, proposal: Proposal): Promise<string> {
    validateProposal(proposal);

    const proposalId = Date.now().toString();
    const proposalData: ProposalData = {
      id: proposalId,
      proposer,
      content: proposal,
      status: 'ACTIVE',
      startTime: Date.now(),
      endTime: Date.now() + this.proposalDuration,
      votes: {
        yes: 0,
        no: 0
      }
    };

    this.proposals.set(proposalId, proposalData);
    this.activeProposals.add(proposalId);
    this.emit('proposalCreated', proposalData);

    return proposalId;
  }

  // Método para votar
  async vote(voter: string, proposalId: string, vote: boolean): Promise<void> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.status !== 'ACTIVE') {
      throw new Error('Invalid or inactive proposal');
    }

    const voterStake = this.blockchain.stakingPallet.getStake(voter);
    if (!voterStake) {
      throw new Error('Only stakers can vote');
    }

    const voteWeight = Math.sqrt(voterStake); // Square root voting power
    const voteKey = `${proposalId}-${voter}`;

    if (this.votes.has(voteKey)) {
      throw new Error('Already voted');
    }

    this.votes.set(voteKey, vote);
    proposal.votes[vote ? 'yes' : 'no'] += voteWeight;

    if (Date.now() >= proposal.endTime) {
      await this.finalizeProposal(proposalId);
    }
  }

  // Método para finalizar una propuesta
  async finalizeProposal(proposalId: string): Promise<void> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.status !== 'ACTIVE') return;

    const result = proposal.votes.yes > proposal.votes.no;
    proposal.status = result ? 'APPROVED' : 'REJECTED';
    this.activeProposals.delete(proposalId);

    if (result) {
      await this.executeProposal(proposal);
    }

    this.emit('proposalFinalized', {
      proposalId,
      result,
      votes: proposal.votes
    });
  }

  // Método para ejecutar la propuesta
  async executeProposal(proposal: ProposalData): Promise<void> {
    switch (proposal.content.type) {
      case 'PARAMETER_CHANGE':
        await this.executeParameterChange(proposal.content.data);
        break;
      case 'UPGRADE':
        await this.executeUpgrade(proposal.content.data);
        break;
      case 'EMERGENCY':
        await this.executeEmergencyAction(proposal.content.data);
        break;
      default:
        throw new Error(`Unsupported proposal type: ${proposal.content.type}`);
    }
  }

  // Métodos placeholders para ejecución de propuestas
  private async executeParameterChange(_data: any): Promise<void> {
    // Implementación de cambio de parámetros
  }

  private async executeUpgrade(_data: any): Promise<void> {
    // Implementación de actualización
  }

  private async executeEmergencyAction(_data: any): Promise<void> {
    // Implementación de acción de emergencia
  }

  // Obtener los detalles de una propuesta
  getProposal(proposalId: string): ProposalData | undefined {
    return this.proposals.get(proposalId);
  }

  // Obtener las propuestas activas
  getActiveProposals(): ProposalData[] {
    return Array.from(this.activeProposals)
      .map(id => this.proposals.get(id))
      .filter(Boolean) as ProposalData[];
  }
}
