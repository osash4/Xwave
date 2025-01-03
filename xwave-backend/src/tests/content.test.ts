import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { VideoContent } from '../content/VideoContent';
import { MusicContent } from '../content/MusicContent';
import { GameContent } from '../content/GameContent';

describe('Content', () => {
  it('should create video content with correct properties', () => {
    const video = new VideoContent('Test Video', 'creator1', 10, 300, '1080p');
    
    expect(video.title).to.equal('Test Video');
    expect(video.creator).to.equal('creator1');
    expect(video.price).to.equal(10);
    expect(video.duration).to.equal(300);
    expect(video.resolution).to.equal('1080p');
    expect(video.type).to.equal('video');
  });

  it('should create music content with correct properties', () => {
    const music = new MusicContent('Test Song', 'artist1', 5, 180, 'Rock');
    
    expect(music.title).to.equal('Test Song');
    expect(music.creator).to.equal('artist1');
    expect(music.price).to.equal(5);
    expect(music.duration).to.equal(180);
    expect(music.genre).to.equal('Rock');
    expect(music.type).to.equal('music');
  });

  it('should create game content with correct properties', () => {
    const requirements = { os: 'Windows 10', ram: '8GB' };
    const game = new GameContent('Test Game', 'studio1', 50, 'RPG', requirements);
    
    expect(game.title).to.equal('Test Game');
    expect(game.creator).to.equal('studio1');
    expect(game.price).to.equal(50);
    expect(game.genre).to.equal('RPG');
    expect(game.requirements).to.deep.equal(requirements);
    expect(game.type).to.equal('game');
  });
});
