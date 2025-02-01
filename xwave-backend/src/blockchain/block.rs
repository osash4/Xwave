use crate::blockchain::transaction::Transaction;
use crate::utils::crypto::calculate_hash;
use serde::{Serialize, Deserialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct BlockData {
    previous_hash: String,
    timestamp: u64,
    transactions: Vec<Transaction>,
    validator: Option<String>,
}

#[derive(Clone, Debug)]
pub struct Block {
    pub timestamp: u64,
    pub transactions: Vec<Transaction>,
    pub previous_hash: String,
    pub validator: Option<String>,
    pub hash: String, // Added hash field
}

impl Block {
    // Constructor (función asociada)
    pub fn new(
        timestamp: u64,
        transactions: Vec<Transaction>,
        previous_hash: String,
        validator: Option<String>, // El validador es opcional
    ) -> Result<Block, String> {
        // Validación de que las transacciones no estén vacías
        if transactions.is_empty() {
            return Err("El bloque debe contener al menos una transacción.".to_string());
        }

        // Crear el bloque sin hash calculado
        let mut block = Block {
            timestamp,
            transactions,
            previous_hash,
            validator,
            hash: String::new(), // Inicialmente vacío
        };

        // Calcular el hash del bloque
        block.set_hash()?;

        Ok(block)
    }

    // Método para calcular el hash
    pub fn calculate_hash(&self) -> Result<String, String> {
        let block_data = BlockData {
            previous_hash: self.previous_hash.clone(),
            timestamp: self.timestamp,
            transactions: self.transactions.clone(), // Necesitamos clonarlo porque Vec no es prestado
            validator: self.validator.clone(),
        };

        // Usamos la función calculate_hash para obtener el hash
        calculate_hash(&block_data)
    }

    // Método para actualizar el hash
    pub fn set_hash(&mut self) -> Result<(), String> {
        self.hash = self.calculate_hash()?;
        Ok(())
    }

    // Método para obtener el hash
    pub fn hash(&self) -> &str {
        &self.hash
    }
}

fn main() {
    // Create some dummy transactions
    let transactions: Vec<Transaction> = vec![
        Transaction::new("sender1".to_string(), "receiver1".to_string(), 50.0).unwrap(),
        Transaction::new("sender2".to_string(), "receiver2".to_string(), 30.0).unwrap(),
    ];

    // Get the current timestamp
    let start = SystemTime::now();
    let since_the_epoch = start.duration_since(UNIX_EPOCH).expect("Time went backwards");
    let timestamp = since_the_epoch.as_secs();

    // Create a new block
    let previous_hash = String::from("previous_hash_example");
    let validator = Some(String::from("validator_example"));

    match Block::new(timestamp, transactions, previous_hash, validator) {
        Ok(block) => println!("Block created successfully: {:?}", block),
        Err(e) => println!("Failed to create block: {}", e),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_block_creation() {
        let transactions = vec![
            Transaction::new("sender1".to_string(), "receiver1".to_string(), 50.0).unwrap(),
            Transaction::new("sender2".to_string(), "receiver2".to_string(), 30.0).unwrap(),
        ];
        let previous_hash = String::from("previous_hash_example");
        let validator = Some(String::from("validator_example"));
        let timestamp = 1234567890;

        let block = Block::new(timestamp, transactions, previous_hash, validator).unwrap();
        assert_eq!(block.timestamp, timestamp);
        assert_eq!(block.transactions.len(), 2);
        assert_eq!(block.previous_hash, "previous_hash_example");
        assert_eq!(block.validator, Some("validator_example".to_string()));
        assert!(!block.hash.is_empty());
    }

    #[test]
    fn test_empty_transactions() {
        let transactions = vec![];
        let previous_hash = String::from("previous_hash_example");
        let validator = Some(String::from("validator_example"));
        let timestamp = 1234567890;

        let result = Block::new(timestamp, transactions, previous_hash, validator);
        assert!(result.is_err());
    }
}