use serde::{Serialize, Deserialize};
use crate::utils::calculate_hash; // Importar la función para calcular el hash
use chrono::Utc;

#[derive(Serialize, Deserialize, Debug)]
pub struct Transaction {
    pub from_address: String,
    pub to_address: String,
    pub amount: f64,
    pub timestamp: u64,
    pub hash: String,
}

impl Transaction {
    // Constructor para crear una nueva transacción
    pub fn new(from_address: String, to_address: String, amount: f64) -> Result<Transaction, String> {
        // Validaciones
        if from_address.is_empty() || to_address.is_empty() {
            return Err("Las direcciones no pueden ser nulas o vacías.".to_string());
        }
        if from_address == to_address && from_address != "genesisAddress" {
            return Err("La dirección del remitente no puede ser igual a la del destinatario.".to_string());
        }
        if amount <= 0.0 {
            return Err("El monto de la transacción debe ser mayor que 0.".to_string());
        }

        let timestamp = get_current_timestamp();
        let tx = Transaction {
            from_address,
            to_address,
            amount,
            timestamp,
            hash: String::new(),
        };
        let mut tx = tx;
        tx.hash = tx.calculate_hash();  // Calcular el hash al crear la transacción

        Ok(tx)
    }

    // Método para calcular el hash de la transacción
    pub fn calculate_hash(&self) -> String {
        let transaction_data = TransactionData {
            from_address: self.from_address.clone(),
            to_address: self.to_address.clone(),
            amount: self.amount,
            timestamp: self.timestamp,
        };
        calculate_hash(&transaction_data) // Utilizar la función de hash que migramos antes
    }

    // Método para validar la transacción
    pub fn is_valid(&self) -> bool {
        if self.amount <= 0.0 {
            return false;
        }
        if self.from_address.is_empty() || self.to_address.is_empty() {
            return false;
        }
        // Validar direcciones adicionales si es necesario
        self.are_addresses_valid()
    }

    // Validar las direcciones
    fn are_addresses_valid(&self) -> bool {
        self.to_address != "genesisAddress" && !self.from_address.is_empty()
    }
}

// Estructura para los datos de la transacción (para el cálculo del hash)
#[derive(Serialize, Deserialize, Debug)]
pub struct TransactionData {
    pub from_address: String,
    pub to_address: String,
    pub amount: f64,
    pub timestamp: u64,
}

// Función para obtener el timestamp actual
fn get_current_timestamp() -> u64 {
    // Esto simula Date.now() en JavaScript. En Rust, se puede usar el crate chrono.
    Utc::now().timestamp_millis() as u64
}
