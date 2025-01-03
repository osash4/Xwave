use sha2::{Sha256, Digest};
use std::collections::HashMap;
use serde::{Serialize, Deserialize};
use serde_json;

#[derive(Serialize, Deserialize)]
pub struct Transaction {
    // Aquí puedes agregar los campos de la transacción
}

pub fn calculate_hash(data: &dyn serde::Serialize) -> String {
    // Convertimos los datos a una cadena JSON
    let serialized_data = serde_json::to_string(data).expect("Error serializando los datos");

    // Creamos el hash SHA-256 de los datos serializados
    let mut hasher = Sha256::new();
    hasher.update(serialized_data);
    let result = hasher.finalize();

    // Convertimos el resultado en una cadena hexadecimal
    format!("{:x}", result)
}
