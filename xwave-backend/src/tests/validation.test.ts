import { describe, it } from 'mocha';
import { expect } from 'chai';
import { validateContentMetadata } from '../utils/validation';

describe('Content Validation', () => {
  it('should validate correct content metadata', () => {
    const validMetadata = {
      title: 'Test Content',
      creator: 'creator1',
      price: 10,
      type: 'video'
    };

    expect(() => validateContentMetadata(validMetadata)).not.to.throw();
  });

  it('should reject invalid title', () => {
    const invalidMetadata = {
      title: '',
      creator: 'creator1',
      price: 10,
      type: 'video'
    };

    expect(() => validateContentMetadata(invalidMetadata)).to.throw('Invalid title');
  });

  it('should reject invalid price', () => {
    const invalidMetadata = {
      title: 'Test Content',
      creator: 'creator1',
      price: -10,
      type: 'video'
    };

    expect(() => validateContentMetadata(invalidMetadata)).to.throw('Invalid price');
  });

  it('should reject invalid content type', () => {
    const invalidMetadata = {
      title: 'Test Content',
      creator: 'creator1',
      price: 10,
      type: 'invalid'
    };

    expect(() => validateContentMetadata(invalidMetadata)).to.throw('Invalid content type');
  });
});
