import { validateContentMetadata } from '../../../utils/validation';
import { IPFSStorage } from '../../../storage/ipfs';

interface Token {
  id: string;
  creator: string;
  contentHash: string;
  metadataHash: string;
  createdAt: number;
  status: string;
  version: number;
}

interface HistoryRecord {
  action: string;
  data: Record<string, any>;
  timestamp: number;
}

export class NFTContract {
  private blockchain: any;  // Se puede cambiar por un tipo más específico si se desea
  private ipfs: IPFSStorage;
  private tokens: Map<string, Token>;
  private metadata: Map<string, any>;
  private history: Map<string, HistoryRecord[]>;

  constructor(blockchain: any) {
    if (!blockchain) {
      throw new Error("Blockchain instance is required");
    }
    this.blockchain = blockchain;
    this.ipfs = new IPFSStorage();
    this.tokens = new Map();
    this.metadata = new Map();
    this.history = new Map();
  }

  async mintNFT(creator: string, content: Buffer, metadata: any): Promise<Token> {
    validateContentMetadata(metadata);

    // Subir contenido y metadatos a IPFS
    const { contentHash, metadataHash } = await this.ipfs.uploadContent(content, metadata);

    const token: Token = {
      id: Date.now().toString(),
      creator,
      contentHash,
      metadataHash,
      createdAt: Date.now(),
      status: 'ACTIVE',
      version: 1
    };

    // Uso de la variable blockchain: Emite una transacción (esto es solo un ejemplo de cómo podrías usarla)
    try {
      const transactionResult = await this.blockchain.emitTransaction({
        type: 'mintNFT',
        tokenId: token.id,
        creator: creator,
        contentHash: contentHash,
        metadataHash: metadataHash,
        status: token.status
      });
      console.log('Transaction result:', transactionResult);
    } catch (error) {
      console.error('Error emitting transaction:', error);
    }

    this.tokens.set(token.id, token);
    this.metadata.set(token.id, metadata);
    this.recordHistory(token.id, 'MINT', { creator });

    return token;
  }

  async updateMetadata(tokenId: string, newMetadata: any, updater: string): Promise<Token> {
    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error('Token not found');
    }

    if (updater !== token.creator) {
      throw new Error('Only creator can update metadata');
    }

    validateContentMetadata(newMetadata);
    const { metadataHash } = await this.ipfs.uploadContent(null, newMetadata);

    token.metadataHash = metadataHash;
    token.version += 1;
    this.metadata.set(tokenId, newMetadata);

    // Uso de la variable blockchain: Emite una transacción para actualizar metadata
    try {
      const transactionResult = await this.blockchain.emitTransaction({
        type: 'updateMetadata',
        tokenId: token.id,
        newMetadataHash: metadataHash,
        updater: updater
      });
      console.log('Transaction result:', transactionResult);
    } catch (error) {
      console.error('Error emitting transaction:', error);
    }

    this.recordHistory(tokenId, 'UPDATE', { 
      updater, 
      oldMetadataHash: token.metadataHash,
      newMetadataHash: metadataHash 
    });

    return token;
  }

  async verifyAuthenticity(tokenId: string): Promise<{ isAuthentic: boolean; token: Token; history: HistoryRecord[] }> {
    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error('Token not found');
    }

    const storedMetadata = await this.ipfs.getMetadata(token.metadataHash);
    const currentMetadata = this.metadata.get(tokenId);

    return {
      isAuthentic: JSON.stringify(storedMetadata) === JSON.stringify(currentMetadata),
      token,
      history: this.getHistory(tokenId)
    };
  }

  recordHistory(tokenId: string, action: string, data: Record<string, any>): void {
    if (!this.history.has(tokenId)) {
      this.history.set(tokenId, []);
    }

    this.history.get(tokenId)?.push({
      action,
      data,
      timestamp: Date.now()
    });
  }

  getHistory(tokenId: string): HistoryRecord[] {
    return this.history.get(tokenId) || [];
  }

  async getContent(tokenId: string): Promise<Buffer> {
    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error('Token not found');
    }

    return await this.ipfs.getContent(token.contentHash);
  }
}
