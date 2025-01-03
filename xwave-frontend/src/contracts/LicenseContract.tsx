import { Blockchain } from "../blockchain/Blockchain";

// Definir los términos de la licencia
interface LicenseTerms {
  duration: number; // Duración de la licencia en milisegundos
  price: number; // Precio de la licencia
  restrictions?: string[]; // Restricciones asociadas a la licencia
  renewalOptions?: boolean | null; // Opciones de renovación disponibles
  transferable?: boolean; // Si la licencia es transferible
  maxUsers?: number | null; // Número máximo de usuarios permitidos para la licencia
}

// Estructura de la licencia
interface License {
  contentId: string; // ID del contenido
  terms: LicenseTerms; // Términos de la licencia
  createdAt: number; // Fecha de creación
  status: string; // Estado de la licencia (ACTIVA, INACTIVA)
  users: Set<string>; // Usuarios asociados a la licencia
}

// Licencia del usuario
interface UserLicense {
  user: string; // Dirección del usuario
  contentId: string; // ID del contenido
  grantedAt: number; // Fecha de concesión
  expiresAt: number; // Fecha de expiración
  paymentTx: string; // Hash de la transacción de pago
  status: string; // Estado de la licencia (ACTIVA, INACTIVA)
  renewals?: number; // Cantidad de renovaciones de la licencia
  lastRenewalTx?: string; // Hash de la última transacción de renovación
}

export class LicenseContract {
  blockchain: Blockchain;
  licenses: Map<string, License>;
  activeUsers: Map<string, Map<string, UserLicense>>;

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;
    this.licenses = new Map();
    this.activeUsers = new Map();
  }

  async createLicense(contentId: string, terms: LicenseTerms): Promise<License> {
    const {
      duration,
      price,
      restrictions = [],
      renewalOptions = null,
      transferable = false,
      maxUsers = null
    } = terms;

    const license: License = {
      contentId,
      terms: {
        duration,
        price,
        restrictions,
        renewalOptions,
        transferable,
        maxUsers
      },
      createdAt: Date.now(),
      status: 'ACTIVE',
      users: new Set<string>() // Almacenamos direcciones de usuario
    };

    this.licenses.set(contentId, license);
    return license;
  }

  async grantLicense(contentId: string, user: string, paymentTx: string): Promise<UserLicense> {
    const license = this.licenses.get(contentId);
    if (!license || license.status !== 'ACTIVE') {
      throw new Error('Invalid or inactive license');
    }

    if (license.terms.maxUsers && license.users.size >= license.terms.maxUsers) {
      throw new Error('Maximum number of users reached');
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
    this.activeUsers.get(contentId)?.set(user, userLicense);
    license.users.add(user);

    return userLicense;
  }

  async renewLicense(contentId: string, user: string, paymentTx: string): Promise<UserLicense> {
    const license = this.licenses.get(contentId);
    if (!license || !license.terms.renewalOptions) {
      throw new Error('License renewal not available');
    }

    const userLicense = this.activeUsers.get(contentId)?.get(user);
    if (!userLicense) {
      throw new Error('No active license found for user');
    }

    userLicense.expiresAt += license.terms.duration;
    userLicense.renewals = (userLicense.renewals || 0) + 1;
    userLicense.lastRenewalTx = paymentTx;

    return userLicense;
  }

  async transferLicense(contentId: string, fromUser: string, toUser: string): Promise<UserLicense> {
    const license = this.licenses.get(contentId);
    if (!license || !license.terms.transferable) {
      throw new Error('License transfer not allowed');
    }

    const userLicense = this.activeUsers.get(contentId)?.get(fromUser);
    if (!userLicense || userLicense.status !== 'ACTIVE') {
      throw new Error('No active license found for user');
    }

    // Transfer the license
    userLicense.user = toUser;
    this.activeUsers.get(contentId)?.delete(fromUser);
    this.activeUsers.get(contentId)?.set(toUser, userLicense);
    
    license.users.delete(fromUser);
    license.users.add(toUser);

    return userLicense;
  }

  isLicenseValid(contentId: string, user: string): boolean {
    const userLicense = this.activeUsers.get(contentId)?.get(user);
    if (!userLicense) return false;
    
    return userLicense.status === 'ACTIVE' && 
           userLicense.expiresAt > Date.now();
  }

  getLicenseDetails(contentId: string, user: string): UserLicense | null {
    return this.activeUsers.get(contentId)?.get(user) || null;
  }
}
