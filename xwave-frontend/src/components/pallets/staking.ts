// Definir tipos para las estructuras que utilizas
interface Validator {
  isActive: boolean;
  lastValidation: number;
  totalValidated: number;
  slashes: number;
  reward: number;  // Recompensa acumulada
}

interface SlashingPenalty {
  timestamp: number;
  reason: string;
  amount: number;
}

export class StakingPallet {
  private blockchain: any;  // Mantener la propiedad blockchain
  private validators: Map<string, Validator>;
  private stakes: Map<string, number>;
  private minimumStake: number;
  private slashingPenalties: Map<string, SlashingPenalty[]>;  // Cambié a un Map con valor de un array de penalizaciones

  constructor(blockchain: any) {
    this.blockchain = blockchain;  // Inicialización de la blockchain
    this.validators = new Map();
    this.stakes = new Map();
    this.minimumStake = 1000;  // Monto mínimo para que un validador participe
    this.slashingPenalties = new Map();
  }

  // Método para hacer staking
  async stake(address: string, amount: number): Promise<boolean> {
    const currentStake = this.stakes.get(address) || 0;

    if (amount + currentStake >= this.minimumStake) {
      this.stakes.set(address, currentStake + amount);
      this.validators.set(address, {
        isActive: true,
        lastValidation: 0,
        totalValidated: 0,
        slashes: 0,
        reward: 0  // Inicializa la recompensa en 0
      });
      
      // Ejemplo de interacción con la blockchain (registrar el staking)
      await this.blockchain.recordStake(address, amount);  // Este método debe estar implementado en tu clase blockchain

      return true;
    }
    
    return false;
  }

  // Método para hacer unstake
  async unstake(address: string, amount: number): Promise<boolean> {
    const currentStake = this.stakes.get(address) || 0;
    if (currentStake - amount < this.minimumStake) {
      throw new Error('Remaining stake would be below minimum');
    }

    this.stakes.set(address, currentStake - amount);
    
    // Ejemplo de interacción con la blockchain (registrar el unstaking)
    await this.blockchain.recordUnstake(address, amount);  // Este método debe estar implementado en tu clase blockchain
    
    return true;
  }

  // Método para calcular recompensa
  calculateReward(address: string): number {
    const stake = this.stakes.get(address) || 0;
    const validator = this.validators.get(address);
    
    if (!validator || !validator.isActive) return 0;
    
    const baseReward = 10;  // Recompensa base por validación
    const stakeMultiplier = stake / this.minimumStake;  // Recompensa proporcional al stake
    const performanceMultiplier = validator.totalValidated / 100;  // Bonificación por rendimiento de validación
    
    return baseReward * stakeMultiplier * performanceMultiplier;
  }

  // Método para distribuir recompensas
  async distributeRewards(): Promise<void> {
    this.validators.forEach(async (validator, address) => {
      if (validator.isActive) {
        const reward = this.calculateReward(address);
        validator.reward += reward;  // Acumula la recompensa

        // Registrar la recompensa en la blockchain
        await this.blockchain.recordReward(address, reward);  // Este método debe estar implementado en tu clase blockchain
      }
    });
  }

  // Método para penalizar
  slash(address: string, reason: string): void {
    const stake = this.stakes.get(address) || 0;
    const penalty = stake * 0.5;  // Penalización del 50% por mal comportamiento
    
    this.stakes.set(address, stake - penalty);

    // Asegurarse de que las penalizaciones son almacenadas como un array
    const existingPenalties = this.slashingPenalties.get(address) || [];
    existingPenalties.push({
      timestamp: Date.now(),
      reason,
      amount: penalty
    });
    this.slashingPenalties.set(address, existingPenalties);
    
    const validator = this.validators.get(address);
    if (validator) {
      validator.slashes += 1;
      if (validator.slashes >= 3) {
        validator.isActive = false;  // Desactivar al validador si llega a 3 penalizaciones
      }
    }
  }

  // Obtener el estado de un validador
  getValidatorStatus(address: string): Validator | null {
    return this.validators.get(address) || null;
  }

  // Obtener el total de stakes de todos los validadores
  getTotalStake(): number {
    return Array.from(this.stakes.values()).reduce((a, b) => a + b, 0);
  }

  // Método para obtener las penalizaciones de un validador
  getSlashingPenalties(address: string): SlashingPenalty[] {
    const penalties = this.slashingPenalties.get(address) || [];
    return penalties.filter(penalty => penalty.amount > 0);
  }
}
