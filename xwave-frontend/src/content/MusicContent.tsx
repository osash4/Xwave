import { BaseContent } from './BaseContent.js';

export class MusicContent extends BaseContent {
  constructor(title, creator, price, duration, genre) {
    super(title, creator, price);
    this.duration = duration;
    this.genre = genre;
    this.type = 'music';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      duration: this.duration,
      genre: this.genre,
      type: this.type
    };
  }
}