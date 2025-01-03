use reqwest::Client;
use serde::{Deserialize, Serialize};
use tokio;

// URL del API
const API_URL: &str = "http://localhost:9933/rpc";

// Estructura para manejar la respuesta JSON del balance
#[derive(Deserialize)]
struct RpcResponse {
    result: String,
}

#[derive(Serialize)]
struct RpcRequest<'a> {
    jsonrpc: &'a str,
    method: &'a str,
    params: Vec<String>,
    id: u32,
}

// Obtener balance
async fn get_balance(address: &str) -> Result<u64, Box<dyn std::error::Error>> {
    let client = Client::new();
    let request = RpcRequest {
        jsonrpc: "2.0",
        method: "state_getStorage",
        params: vec![address.to_string()],
        id: 1,
    };

    let response = client
        .post(API_URL)
        .json(&request)
        .send()
        .await?
        .json::<RpcResponse>()
        .await?;

    // Convertir el resultado de hex a número
    let balance = u64::from_str_radix(&response.result[2..], 16)?; // Hex a número
    Ok(balance)
}

// Simulación de transferir tokens
async fn transfer_tokens(from: &str, to: &str, amount: u64) -> Result<String, Box<dyn std::error::Error>> {
    let client = Client::new();
    
    // Aquí necesitaríamos generar un extrínseco firmado, lo cual puede hacerse con bibliotecas específicas como subxt.
    let extrinsic = "0x..."; // Esto es solo un marcador de posición para un extrínseco firmado.

    let request = RpcRequest {
        jsonrpc: "2.0",
        method: "author_submitExtrinsic",
        params: vec![extrinsic.to_string()],
        id: 1,
    };

    let response = client
        .post(API_URL)
        .json(&request)
        .send()
        .await?
        .json::<RpcResponse>()
        .await?;

    Ok(response.result)
}

#[tokio::main]
async fn main() {
    // Ejemplo de uso
    let address = "user_address";

    match get_balance(address).await {
        Ok(balance) => println!("Balance: {}", balance),
        Err(err) => eprintln!("Error al obtener balance: {}", err),
    }

    let from = "user_from_address";
    let to = "user_to_address";
    let amount = 100;

    match transfer_tokens(from, to, amount).await {
        Ok(tx_hash) => println!("Transacción realizada, hash: {}", tx_hash),
        Err(err) => eprintln!("Error al transferir tokens: {}", err),
    }
}
