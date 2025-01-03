export const config = {
  server: {
    port: 3000,
    wsPort: 8080
  },
  blockchain: {
    minimumStake: 1000,
    difficulty: 4,
    validatorReward: 1
  },
  mediasoup: {
    worker: {
      logLevel: 'warn',
      logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
      rtcMinPort: 10000,
      rtcMaxPort: 10100
    },
    router: {
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
    },
    webRtcTransport: {
      listenIps: [
        {
          ip: '127.0.0.1',
          announcedIp: null
        }
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true
    }
  }
};