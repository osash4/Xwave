use sha2::{Sha256, Digest};
use serde::{Serialize, Deserialize};
use serde_json;



#[derive(Serialize, Deserialize)]
pub struct Transaction {
    // Aquí puedes agregar los campos de la transacción
}

pub fn calculate_hash<T: Serialize>(data: &T) -> Result<String, String> {
    // Intentamos serializar los datos a una cadena JSON
    let serialized_data = serde_json::to_string(data)
        .map_err(|e| format!("Error serializando los datos: {}", e))?;

    // Creamos el hash SHA-256 de los datos serializados
    let mut hasher = Sha256::new();
    hasher.update(serialized_data);
    let result = hasher.finalize();

    // Convertimos el resultado en una cadena hexadecimal y la retornamos
    Ok(format!("{:x}", result))
}
