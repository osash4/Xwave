import { v4 as uuidv4 } from 'uuid';

export class BaseContent {
  constructor(title, creator, price) {
    this.id = uuidv4();
    this.title = title;
    this.creator = creator;
    this.price = price;
    this.timestamp = Date.now();
    this.contentHash = '';
  }

  setContentHash(hash) {
    this.contentHash = hash;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      creator: this.creator,
      price: this.price,
      timestamp: this.timestamp,
      contentHash: this.contentHash
    };
  }
}