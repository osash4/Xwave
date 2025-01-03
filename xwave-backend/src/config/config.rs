use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct MediaCodec {
    pub kind: String, // "video" o "audio"
    pub mime_type: String,
    pub clock_rate: u32,
    pub parameters: Option<std::collections::HashMap<String, String>>,
    pub channels: Option<u32>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WorkerConfig {
    pub log_level: String, // "debug", "warn", "error", "info"
    pub log_tags: Vec<String>,
    pub rtc_min_port: u32,
    pub rtc_max_port: u32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RouterConfig {
    pub media_codecs: Vec<MediaCodec>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct WebRtcTransportConfig {
    pub listen_ips: Vec<IpConfig>,
    pub enable_udp: bool,
    pub enable_tcp: bool,
    pub prefer_udp: bool,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct IpConfig {
    pub ip: String,
    pub announced_ip: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BlockchainConfig {
    pub minimum_stake: u32,
    pub difficulty: u32,
    pub validator_reward: u32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ServerConfig {
    pub port: u32,
    pub ws_port: u32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub server: ServerConfig,
    pub blockchain: BlockchainConfig,
    pub mediasoup: MediasoupConfig,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MediasoupConfig {
    pub worker: WorkerConfig,
    pub router: RouterConfig,
    pub web_rtc_transport: WebRtcTransportConfig,
}

// Ejemplo de instanciación de la configuración
pub fn get_config() -> Config {
    Config {
        server: ServerConfig {
            port: 3000,
            ws_port: 8080,
        },
        blockchain: BlockchainConfig {
            minimum_stake: 1000,
            difficulty: 4,
            validator_reward: 1,
        },
        mediasoup: MediasoupConfig {
            worker: WorkerConfig {
                log_level: "warn".to_string(),
                log_tags: vec![
                    "info".to_string(),
                    "ice".to_string(),
                    "dtls".to_string(),
                    "rtp".to_string(),
                    "srtp".to_string(),
                    "rtcp".to_string(),
                ],
                rtc_min_port: 10000,
                rtc_max_port: 10100,
            },
            router: RouterConfig {
                media_codecs: vec![
                    MediaCodec {
                        kind: "video".to_string(),
                        mime_type: "video/VP8".to_string(),
                        clock_rate: 90000,
                        parameters: Some(std::collections::HashMap::from([(
                            "x-google-start-bitrate".to_string(),
                            "1000".to_string(),
                        )])),
                        channels: None,
                    },
                    MediaCodec {
                        kind: "audio".to_string(),
                        mime_type: "audio/opus".to_string(),
                        clock_rate: 48000,
                        parameters: None,
                        channels: Some(2),
                    },
                ],
            },
            web_rtc_transport: WebRtcTransportConfig {
                listen_ips: vec![IpConfig {
                    ip: "127.0.0.1".to_string(),
                    announced_ip: None,
                }],
                enable_udp: true,
                enable_tcp: true,
                prefer_udp: true,
            },
        },
    }
}
