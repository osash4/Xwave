import { BaseContent } from './BaseContent.js';

export class VideoContent extends BaseContent {
  constructor(title, creator, price, duration, resolution) {
    super(title, creator, price);
    this.duration = duration;
    this.resolution = resolution;
    this.type = 'video';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      duration: this.duration,
      resolution: this.resolution,
      type: this.type
    };
  }
}