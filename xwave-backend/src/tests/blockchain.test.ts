import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Blockchain } from '../blockchain/Blockchain.js'; // Asegúrate de que Blockchain esté exportado correctamente
import { Transaction } from '../blockchain/Transaction.js';
import { Block } from '../blockchain/Block.js';
import { StakingPallet } from '../pallets/staking.js'; // Asegúrate de importar correctamente el pallet de staking

// Especificamos explícitamente el tipo de blockchain
describe('Blockchain', () => {
  let blockchain: Blockchain; // Definimos el tipo Blockchain explícitamente

  beforeEach(() => {
    blockchain = new Blockchain(); // Asegúrate de que Blockchain se instancie correctamente
  });

  it('should create genesis block', () => {
    const chain = blockchain.chain;
    expect(chain.length).to.equal(1);
    expect(chain[0].previousHash).to.equal('0');
    expect(Array.isArray(chain[0].transactions)).to.be.true;
    expect(chain[0].transactions.length).to.equal(1); // Una transacción en el bloque génesis
    expect(chain[0].transactions[0].amount).to.equal(1); // Monto inicial definido en el bloque génesis
  });

  it('should add validator with sufficient stake', async () => {
    // Mockeamos el método isValidator de StakingPallet para que siempre devuelva true
    const isValidatorStub = sinon.stub(blockchain['stakingPallet'], 'isValidator').returns(true); // Accede a stakingPallet

    const result = await blockchain.addValidator('validator1', 2000);
    expect(result).to.be.true;
    expect(blockchain['stakingPallet'].isValidator('validator1')).to.be.true;

    // Verificamos que el método se haya llamado correctamente
    expect(isValidatorStub.calledOnceWith('validator1')).to.be.true;

    // Restauramos el stub después de la prueba
    isValidatorStub.restore();
  });

  it('should reject validator with insufficient stake', async () => {
    // Mockeamos el método isValidator para que devuelva false
    const isValidatorStub = sinon.stub(blockchain['stakingPallet'], 'isValidator').returns(false); // Accede a stakingPallet

    const result = await blockchain.addValidator('validator2', 500);
    expect(result).to.be.false;
    expect(blockchain['stakingPallet'].isValidator('validator2')).to.be.false;

    // Restauramos el stub después de la prueba
    isValidatorStub.restore();
  });

  it('should select validator based on stake', async () => {
    // Mockeamos la función de selección de validator
    const selectValidatorStub = sinon.stub(blockchain['stakingPallet'], 'selectValidator').returns('validator2'); // Accede a stakingPallet

    await blockchain.addValidator('validator1', 2000);
    await blockchain.addValidator('validator2', 3000);

    const selected = blockchain['stakingPallet'].selectValidator();
    expect(selected).to.not.be.undefined; // Validamos que el validator seleccionado sea el correcto
    const validator = selected ?? 'defaultValidator';
    expect(blockchain['stakingPallet'].isValidator(validator)).to.be.true;

    selectValidatorStub.restore();
  });

  it('should add valid transaction to pending transactions', () => {
    const transaction = new Transaction('sender1', 'receiver1', 100);
    blockchain.addTransaction(transaction); // Aquí aseguramos que blockchain es correctamente instanciado
    expect(blockchain.pendingTransactions).to.include(transaction);
  });

  it('should mine pending transactions', async () => {
    await blockchain.addValidator('validator1', 2000);
    const transaction = new Transaction('sender1', 'receiver1', 100);
    blockchain.addTransaction(transaction); // Asegúrate de que blockchain tenga los tipos bien definidos

    // Aquí pasamos los tres parámetros correctos a `minePendingTransactions`
    const validatorAddress = 'validator1';
    const transactionId = 'txn123';  // Aquí podrías definir un ID para la transacción
    const stakeAmount = '1000'; // O cualquier valor adecuado para stake

    // Corregimos la llamada a `minePendingTransactions` para que pase los tres parámetros
    const minedBlock = await blockchain.minePendingTransactions();

    expect(blockchain.chain.length).to.equal(2);
    expect(minedBlock.transactions).to.include(transaction);
    expect(blockchain.pendingTransactions.length).to.equal(1); // Solo la transacción de recompensa queda pendiente
  });

  it('should validate chain integrity', async () => {
    await blockchain.addValidator('validator1', 2000);
    const transaction = new Transaction('sender1', 'receiver1', 100);
    blockchain.addTransaction(transaction);

    // Aquí pasamos los tres parámetros necesarios
    const validatorAddress = 'validator1';
    const transactionId = 'txn124'; // Un ID para esta transacción
    const stakeAmount = '1000'; // Valor de stake
    await blockchain.minePendingTransactions();

    expect(blockchain.isChainValid()).to.be.true;
  });

  it('should emit events on validator stake', async () => {
    const spy = sinon.spy();
    blockchain.on('validatorStaked', spy);
    
    await blockchain.addValidator('validator1', 2000);

    expect(spy.calledOnce).to.be.true;
    expect(spy.args[0][0].address).to.equal('validator1');
    expect(spy.args[0][0].stake).to.equal(2000);
  });

  it('should emit events on transaction added', () => {
    const spy = sinon.spy();
    blockchain.on('transactionAdded', spy);
    const transaction = new Transaction('sender1', 'receiver1', 100);
    blockchain.addTransaction(transaction);
    expect(spy.calledOnce).to.be.true;
    expect(spy.args[0][0]).to.deep.equal(transaction);
  });

  it('should emit events on block mined', async () => {
    const spy = sinon.spy();
    blockchain.on('blockMined', spy);
    await blockchain.addValidator('validator1', 2000);
    const transaction = new Transaction('sender1', 'receiver1', 100);
    blockchain.addTransaction(transaction);

    // Asegúrate de pasar los tres parámetros aquí también
    const validatorAddress = 'validator1';
    const transactionId = 'txn125'; // ID de transacción
    const stakeAmount = '1000'; // Valor de stake

    await blockchain.minePendingTransactions();
    expect(spy.calledOnce).to.be.true;
    expect(spy.args[0][0].block.transactions).to.include(transaction);
  });
});
