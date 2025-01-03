use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};
use futures_util::{StreamExt, SinkExt};
use std::collections::HashMap;
use tokio::sync::broadcast;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use tokio::time::sleep;

#[derive(Serialize, Deserialize)]
pub struct MessageData {
    pub type_: String,
    pub data: serde_json::Value,
}

pub struct PeerNetwork {
    peers: HashMap<String, tokio_tungstenite::WebSocketStream<tokio::net::TcpStream>>,
    tx: broadcast::Sender<MessageData>,
}

impl PeerNetwork {
    pub fn new() -> Self {
        let (tx, _) = broadcast::channel(16); // Canal para enviar mensajes a todos los peers
        PeerNetwork {
            peers: HashMap::new(),
            tx,
        }
    }

    // Validar si el peer tiene un ID válido
    fn validate_peer(peer_id: &str) -> bool {
        // Aquí puedes agregar una lógica de validación más compleja si es necesario
        !peer_id.is_empty()
    }

    // Método para conectar a un peer con reintentos
    pub async fn connect_to_peer(&mut self, address: &str) -> Result<(), Box<dyn std::error::Error>> {
        let mut attempts = 0;
        while attempts < 5 {
            match connect_async(address).await {
                Ok((ws_stream, _)) => {
                    let peer_id = address.to_string(); // Utiliza la dirección como peer_id
                    if Self::validate_peer(&peer_id) {
                        self.peers.insert(peer_id, ws_stream);
                        println!("Connected to peer: {}", peer_id);
                        return Ok(());
                    } else {
                        println!("Invalid peer ID: {}", peer_id);
                    }
                }
                Err(e) => {
                    println!("Error connecting to {}: {}. Retrying...", address, e);
                    attempts += 1;
                    sleep(Duration::from_secs(2)).await; // Reintentar después de 2 segundos
                }
            }
        }
        Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, "Failed to connect after 5 attempts")))
    }

    // Enviar mensaje a todos los peers conectados
    pub async fn broadcast(&self, message: MessageData) -> Result<(), Box<dyn std::error::Error>> {
        let message = serde_json::to_string(&message)?;

        for (peer_id, peer_stream) in &self.peers {
            if let Err(e) = peer_stream.send(Message::Text(message.clone())).await {
                println!("Error sending message to peer {}: {}", peer_id, e);
            }
        }
        Ok(())
    }

    // Manejar mensajes entrantes de los peers
    pub async fn handle_peer_messages(&mut self) {
        let mut rx = self.tx.subscribe();
        while let Ok(message) = rx.recv().await {
            println!("Received message from peer network: {:?}", message);
        }
    }

    // Manejo de la desconexión de un peer
    pub async fn handle_peer_disconnection(&mut self, peer_id: &str) {
        if let Some(peer_stream) = self.peers.remove(peer_id) {
            if let Err(e) = peer_stream.close().await {
                println!("Error closing connection with peer {}: {}", peer_id, e);
            }
            println!("Peer {} disconnected", peer_id);
        }
    }
}

#[tokio::main]
async fn main() {
    let mut peer_network = PeerNetwork::new();

    // Conectar a un peer con reintentos
    if let Err(e) = peer_network.connect_to_peer("ws://localhost:8080").await {
        eprintln!("Failed to connect to peer: {}", e);
        return;
    }

    // Enviar un mensaje a todos los peers
    let message = MessageData {
        type_: "info".to_string(),
        data: serde_json::json!({"status": "peer connected"}),
    };

    if let Err(e) = peer_network.broadcast(message).await {
        eprintln!("Error broadcasting message: {}", e);
    }

    // Manejar la desconexión de un peer
    peer_network.handle_peer_disconnection("ws://localhost:8080").await;
}
