interface LicenseTerms {
  duration: number;  // Duración en milisegundos
  price: number;  // Precio en la moneda del sistema
  restrictions?: string[];  // Restricciones de uso
  renewalOptions?: boolean;  // Opción de renovación
  transferable?: boolean;  // Si se puede transferir
  maxUsers?: number;  // Máximo número de usuarios permitidos
}

interface License {
  contentId: string;
  terms: LicenseTerms;
  createdAt: number;
  status: string;
  users: Set<string>;
}

interface UserLicense {
  user: string;
  contentId: string;
  grantedAt: number;
  expiresAt: number;
  paymentTx: string;
  status: string;
  renewals?: number;
  lastRenewalTx?: string;
}

export class LicenseContract {
  private blockchain: any;  // Blockchain para registrar las transacciones
  private licenses: Map<string, License>;
  private activeUsers: Map<string, Map<string, UserLicense>>;  // Almacena licencias activas por usuario y contenido

  constructor(blockchain: any) {
    this.blockchain = blockchain;
    this.licenses = new Map();
    this.activeUsers = new Map();
  }

  // Crear una nueva licencia
  async createLicense(contentId: string, terms: LicenseTerms): Promise<License> {
    const license: License = {
      contentId,
      terms,
      createdAt: Date.now(),
      status: 'ACTIVE',
      users: new Set()
    };

    this.licenses.set(contentId, license);

    // Registrar la transacción en la blockchain
    if (this.blockchain) {
      await this.blockchain.recordTransaction('createLicense', contentId, terms);
    }

    return license;
  }

  // Conceder una licencia a un usuario
  async grantLicense(contentId: string, user: string, paymentTx: string): Promise<UserLicense> {
    const license = this.licenses.get(contentId);
    if (!license || license.status !== 'ACTIVE') {
      throw new Error('Licencia inválida o inactiva');
    }

    if (license.terms.maxUsers && license.users.size >= license.terms.maxUsers) {
      throw new Error('Número máximo de usuarios alcanzado');
    }

    const userLicense: UserLicense = {
      user,
      contentId,
      grantedAt: Date.now(),
      expiresAt: Date.now() + license.terms.duration,
      paymentTx,
      status: 'ACTIVE'
    };

    if (!this.activeUsers.has(contentId)) {
      this.activeUsers.set(contentId, new Map());
    }
    this.activeUsers.get(contentId)?.set(user, userLicense);  // Usar ?. para verificar que no sea undefined
    license.users.add(user);

    // Registrar la transacción de concesión de licencia en la blockchain
    if (this.blockchain) {
      await this.blockchain.recordTransaction('grantLicense', contentId, user, paymentTx);
    }

    return userLicense;
  }

  // Renovar la licencia de un usuario
  async renewLicense(contentId: string, user: string, paymentTx: string): Promise<UserLicense> {
    const license = this.licenses.get(contentId);
    if (!license || !license.terms.renewalOptions) {
      throw new Error('Renovación de licencia no disponible');
    }

    const userLicense = this.activeUsers.get(contentId)?.get(user);  // Usar ?. para verificar que no sea undefined
    if (!userLicense) {
      throw new Error('No se encontró una licencia activa para el usuario');
    }

    userLicense.expiresAt += license.terms.duration;
    userLicense.renewals = (userLicense.renewals || 0) + 1;
    userLicense.lastRenewalTx = paymentTx;

    // Registrar la transacción de renovación en la blockchain
    if (this.blockchain) {
      await this.blockchain.recordTransaction('renewLicense', contentId, user, paymentTx);
    }

    return userLicense;
  }

  // Transferir la licencia de un usuario a otro
  async transferLicense(contentId: string, fromUser: string, toUser: string): Promise<UserLicense> {
    const license = this.licenses.get(contentId);
    if (!license || !license.terms.transferable) {
      throw new Error('Transferencia de licencia no permitida');
    }

    const userLicense = this.activeUsers.get(contentId)?.get(fromUser);  // Usar ?. para verificar que no sea undefined
    if (!userLicense || userLicense.status !== 'ACTIVE') {
      throw new Error('No se encontró una licencia activa para el usuario');
    }

    // Transferir la licencia
    userLicense.user = toUser;
    this.activeUsers.get(contentId)?.delete(fromUser);  // Usar ?. para verificar que no sea undefined
    this.activeUsers.get(contentId)?.set(toUser, userLicense);  // Usar ?. para verificar que no sea undefined
    
    license.users.delete(fromUser);
    license.users.add(toUser);

    // Registrar la transacción de transferencia en la blockchain
    if (this.blockchain) {
      await this.blockchain.recordTransaction('transferLicense', contentId, fromUser, toUser);
    }

    return userLicense;
  }

  // Verificar si una licencia es válida
  isLicenseValid(contentId: string, user: string): boolean {
    const userLicense = this.activeUsers.get(contentId)?.get(user);  // Usar ?. para verificar que no sea undefined
    if (!userLicense) return false;
    
    return userLicense.status === 'ACTIVE' && 
           userLicense.expiresAt > Date.now();
  }

  // Obtener los detalles de la licencia de un usuario
  getLicenseDetails(contentId: string, user: string): UserLicense | null {
    return this.activeUsers.get(contentId)?.get(user) || null;  // Usar ?. para verificar que no sea undefined
  }
}
