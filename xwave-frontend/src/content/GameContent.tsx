import { BaseContent } from './BaseContent.js';

export class GameContent extends BaseContent {
  constructor(title, creator, price, genre, requirements) {
    super(title, creator, price);
    this.genre = genre;
    this.requirements = requirements;
    this.type = 'game';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      genre: this.genre,
      requirements: this.requirements,
      type: this.type
    };
  }
}