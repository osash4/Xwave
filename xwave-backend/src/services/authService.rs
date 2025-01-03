use ring::{digest, signature};
use std::time::{SystemTime, UNIX_EPOCH};

/// Generar mensaje único (basado en timestamp y dirección)
pub fn generate_message(address: &str) -> String {
    let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis();
    format!("Autentícate en XWave: {} para {}", timestamp, address)
}

/// Simular una firma (generar un hash del mensaje y agregar una clave privada a la firma)
pub fn sign_message(private_key: &str, message: &str) -> String {
    // Generar hash del mensaje
    let message_hash = digest::digest(&digest::SHA256, message.as_bytes());

    // Simular la firma concatenando el hash con la clave privada (esto es solo una simulación)
    format!("signature-{}-{}", hex::encode(message_hash), private_key)
}

/// Verificar la firma (comparar la firma generada con la firma esperada)
pub fn verify_signature(address: &str, message: &str, signature: &str) -> bool {
    // Generar el hash del mensaje
    let message_hash = digest::digest(&digest::SHA256, message.as_bytes());

    // Generar la firma esperada con la dirección (simulación)
    let expected_signature = format!("signature-{}-{}", hex::encode(message_hash), address);

    // Comparar la firma dada con la esperada
    signature == expected_signature
}

fn main() {
    // Ejemplo de uso
    let address = "user_address";
    let private_key = "user_private_key";

    let message = generate_message(address);
    let signature = sign_message(private_key, &message);

    println!("Mensaje: {}", message);
    println!("Firma: {}", signature);

    // Verificar firma
    let is_valid = verify_signature(address, &message, &signature);
    println!("Firma válida: {}", is_valid);
}
