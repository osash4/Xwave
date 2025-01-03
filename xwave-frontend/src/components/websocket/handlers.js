export const createWebSocketHandlers = (blockchain, streamManager, wss) => ({
  async handleStartStream(ws) {
    try {
      const worker = await streamManager.createWorker();
      const router = await streamManager.createRouter(worker.id);
      const transport = await streamManager.createWebRtcTransport(router.id);
      
      ws.send(JSON.stringify({
        type: 'STREAM_READY',
        transportOptions: {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        }
      }));
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: error.message
      }));
    }
  },

  handleNewBlock(ws) {
    const validator = blockchain.selectValidator();
    blockchain.minePendingTransactions(validator);
    
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify({
          type: 'BLOCKCHAIN_UPDATE',
          chain: blockchain.chain
        }));
      }
    });
  }
});