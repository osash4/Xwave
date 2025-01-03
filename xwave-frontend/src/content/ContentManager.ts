import {Level} from 'level'; // Asegúrate de que esta línea sea correcta
import { create } from 'ipfs-http-client';
import { Transaction } from '../blockchain/Transaction';
import { Buffer } from 'buffer';  // Asegurándonos de que Buffer se importe correctamente

interface Content {
  id: string;
  creator: string;
  type: string;
  contentHash?: string;
  setContentHash: (hash: string) => void;
  toJSON: () => Record<string, unknown>;
}

interface Blockchain {
  addTransaction: (transaction: Transaction) => void;
}

export class ContentManager {
  private db: Level<string, Record<string, unknown>>;  // Correct type for level database
  private ipfs: ReturnType<typeof create>;
  private blockchain: Blockchain;

  constructor(blockchain: Blockchain) {
    this.db = new Level<string, Record<string, unknown>>('content-db', { valueEncoding: 'json' });
    this.ipfs = create({ url: 'http://localhost:5001/api/v0' });
    this.blockchain = blockchain;
  }

  async addContent(content: Content, fileBuffer: Buffer): Promise<string> {
    try {
      // Upload content to IPFS
      const result = await this.ipfs.add(fileBuffer);
      content.setContentHash(result.path);

      if (!content.contentHash) {
        throw new Error('Content hash is required');
      }

      // Store content metadata in LevelDB
      await this.db.put(`content:${content.id}`, content.toJSON());

      // Create blockchain transaction for content registration
      const transaction = new Transaction(
        content.creator,
        "",  // Usar cadena vacía en lugar de 'null'
        0,
        'CONTENT_REGISTRATION',
        {
          type: 'CONTENT_REGISTRATION',
          contentId: content.id,
          contentHash: content.contentHash || ''
        }
      );

      this.blockchain.addTransaction(transaction);

      return content.id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to add content: ${error.message}`);
      }
      throw new Error('Failed to add content due to an unknown error');
    }
  }

  async getContent(contentId: string): Promise<Record<string, unknown>> {
    try {
      return await this.db.get(`content:${contentId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Content not found: ${contentId}`);
      }
      throw new Error('Failed to retrieve content due to an unknown error');
    }
  }

  async listContent(type: string | null = null): Promise<Record<string, unknown>[]> {
    const contents: Record<string, unknown>[] = [];
    for await (const [, value] of this.db.iterator({
      gte: 'content:',
      lte: 'content:\xff'
    })) {
      if (!type || value.type === type) {
        contents.push(value);
      }
    }
    return contents;
  }
}
