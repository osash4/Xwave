import { validateContentMetadata } from '../../utils/validation.js';
import { IPFSStorage } from '../../storage/ipfs.js';
import { Blockchain } from '../blockchain/Blockchain.js';

interface Metadata {
  title: string;
  description: string;
  artist: string;
  fileType: string;
  fileSize: number;
}

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
  blockchain: Blockchain;
  ipfs: IPFSStorage;
  tokens: Map<string, Token>;
  metadata: Map<string, Metadata>;
  history: Map<string, HistoryRecord[]>;

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain;
    this.ipfs = new IPFSStorage();
    this.tokens = new Map();
    this.metadata = new Map();
    this.history = new Map();
  }

  async mintNFT(creator: string, content: Buffer, metadata: Metadata) {
    validateContentMetadata(metadata);

    // Upload content and metadata to IPFS
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

    this.tokens.set(token.id, token);
    this.metadata.set(token.id, metadata);
    this.recordHistory(token.id, 'MINT', { creator });

    return token;
  }

  async updateMetadata(tokenId: string, newMetadata: Metadata, updater: string) {
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

    this.recordHistory(tokenId, 'UPDATE', { 
      updater, 
      oldMetadataHash: token.metadataHash,
      newMetadataHash: metadataHash 
    });

    return token;
  }

  async verifyAuthenticity(tokenId: string) {
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

  recordHistory(tokenId: string, action: string, data: Record<string, any>) {
    if (!this.history.has(tokenId)) {
      this.history.set(tokenId, []);
    }

    this.history.get(tokenId)?.push({
      action,
      data,
      timestamp: Date.now()
    });
  }

  getHistory(tokenId: string) {
    return this.history.get(tokenId) || [];
  }

  async getContent(tokenId: string) {
    const token = this.tokens.get(tokenId);
    if (!token) {
      throw new Error('Token not found');
    }

    return await this.ipfs.getContent(token.contentHash);
  }
}
