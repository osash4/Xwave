use rocket::{post, get, routes, serde::json::Json};
use rocket::serde::{Serialize, Deserialize};
use rocket::tokio::sync::RwLock;
use std::sync::Arc;
use secp256k1::{Secp256k1, Message, PublicKey, Signature};
use sha2::{Sha256, Digest};
use std::str::FromStr;

#[derive(Serialize, Deserialize)]
pub struct SignatureRequest {
    address: String,
    message: String,
    signature: String,
}

#[derive(Serialize, Deserialize)]
pub struct MessageResponse {
    message: String,
}

// Generación de mensaje para la firma
#[get("/generateMessage/<address>")]
async fn generate_message(address: String) -> Json<MessageResponse> {
    // Aquí puedes generar un mensaje según la lógica que usabas en el código anterior
    let message = format!("Firma para la dirección: {}", address);  // Ejemplo de generación de mensaje

    Json(MessageResponse { message })
}

// Verificación de firma
#[post("/verifySignature", format = "json", data = "<signature_request>")]
async fn verify_signature(signature_request: Json<SignatureRequest>) -> Json<String> {
    let secp = Secp256k1::new();
    let message_bytes = Sha256::digest(signature_request.message.as_bytes());
    let message = Message::from_slice(&message_bytes).expect("Invalid message");

    // Convertir la dirección (pubkey) desde una cadena hexadecimal
    let pubkey = PublicKey::from_str(&signature_request.address)
        .map_err(|_| "Invalid public key")?;

    // Convertir la firma desde un formato hexadecimal
    let signature = Signature::from_str(&signature_request.signature)
        .map_err(|_| "Invalid signature")?;

    // Verificar la firma
    let is_valid = secp.verify(&message, &signature, &pubkey).is_ok();

    if is_valid {
        Json("{\"success\": true}".to_string())
    } else {
        Json("{\"error\": \"Firma inválida.\"}".to_string())
    }
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount(
            "/api",
            routes![generate_message, verify_signature],
        )
}
