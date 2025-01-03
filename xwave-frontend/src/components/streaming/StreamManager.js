import mediasoup from 'node-mediasoup';

export class StreamManager {
  constructor() {
    this.workers = new Map();
    this.routers = new Map();
    this.producers = new Map();
    this.consumers = new Map();
  }

  async createWorker() {
    const worker = await mediasoup.createWorker({
      logLevel: 'warn',
      logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
      rtcMinPort: 10000,
      rtcMaxPort: 10100,
    });

    worker.on('died', () => {
      console.error('mediasoup worker died, exiting in 2 seconds... [pid:%d]', worker.pid);
      setTimeout(() => process.exit(1), 2000);
    });

    return worker;
  }

  async createRouter(workerId) {
    const worker = this.workers.get(workerId);
    if (!worker) throw new Error('Worker not found');

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

    this.routers.set(router.id, router);
    return router;
  }

  async createWebRtcTransport(routerId) {
    const router = this.routers.get(routerId);
    if (!router) throw new Error('Router not found');

    return await router.createWebRtcTransport({
      listenIps: [
        {
          ip: '127.0.0.1',
          announcedIp: null,
        }
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });
  }
}