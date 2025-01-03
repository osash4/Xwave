import mediasoup from 'mediasoup';
import { IPFSStorage } from '../storage/ipfs.js';

export class StreamingService {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.ipfsStorage = new IPFSStorage();
    this.activeStreams = new Map();
    this.workers = new Map();
    this.routers = new Map();
  }

  async createStream(creator, metadata) {
    const worker = await mediasoup.createWorker({
      logLevel: 'warn',
      rtcMinPort: 10000,
      rtcMaxPort: 10100
    });

    const router = await worker.createRouter({
      mediaCodecs: [
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters: {
            'x-google-start-bitrate': 1000
          }
        },
        {
          kind: 'audio',
          mimeType: 'audio/opus',
          clockRate: 48000,
          channels: 2
        }
      ]
    });

    const streamId = Date.now().toString();
    this.activeStreams.set(streamId, {
      creator,
      metadata,
      router,
      viewers: new Set(),
      startTime: Date.now()
    });

    this.workers.set(streamId, worker);
    this.routers.set(streamId, router);

    return streamId;
  }

  async joinStream(streamId, viewer) {
    const stream = this.activeStreams.get(streamId);
    if (!stream) {
      throw new Error('Stream not found');
    }

    const transport = await stream.router.createWebRtcTransport({
      listenIps: [{ ip: '127.0.0.1' }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true
    });

    stream.viewers.add(viewer);

    return {
      transportOptions: {
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters
      }
    };
  }

  async endStream(streamId) {
    const stream = this.activeStreams.get(streamId);
    if (!stream) return;

    const worker = this.workers.get(streamId);
    const router = this.routers.get(streamId);

    if (router) await router.close();
    if (worker) await worker.close();

    this.activeStreams.delete(streamId);
    this.workers.delete(streamId);
    this.routers.delete(streamId);

    // Process final payments and royalties
    await this.processStreamPayments(stream);
  }

  async processStreamPayments(stream) {
    const duration = Date.now() - stream.startTime;
    const viewerCount = stream.viewers.size;
    const baseRate = 0.001; // Rate per second per viewer

    const totalAmount = duration * viewerCount * baseRate;
    await this.blockchain.contractsPallet.processRoyaltyPayment(
      stream.creator,
      totalAmount
    );
  }

  getActiveStreams() {
    return Array.from(this.activeStreams.entries()).map(([id, stream]) => ({
      id,
      creator: stream.creator,
      metadata: stream.metadata,
      viewerCount: stream.viewers.size
    }));
  }
}