import { expect } from 'chai';
import Token from '../blockchain/Token';
import { describe, beforeEach, it } from 'mocha';

describe('Token', () => {
    let token: Token;

    beforeEach(() => {
        token = new Token();
    });

    it('should mint tokens correctly', () => {
        token.mint('user1', 100);
        expect(token.balanceOf('user1')).to.equal(100);
    });

    it('should transfer tokens correctly', () => {
        token.mint('user1', 100);
        token.transfer('user1', 'user2', 50);
        expect(token.balanceOf('user1')).to.equal(50);
        expect(token.balanceOf('user2')).to.equal(50);
    });

    it('should throw error for insufficient balance', () => {
        token.mint('user1', 100);
        expect(() => token.transfer('user1', 'user2', 200)).to.throw('Saldo insuficiente');
    });

    it('should return correct balance for accounts', () => {
        token.mint('user1', 100);
        expect(token.balanceOf('user1')).to.equal(100);
        expect(token.balanceOf('user2')).to.equal(0);
    });

    it('should validate sufficient balance', () => {
        token.mint('user1', 100);
        expect(token.hasBalance('user1', 50)).to.be.true;
        expect(token.hasBalance('user1', 200)).to.be.false;
    });
});
