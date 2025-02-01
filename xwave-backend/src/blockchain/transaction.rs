use serde::{Serialize, Deserialize};
use crate::utils::crypto::calculate_hash;
use chrono::Utc;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Transaction {
    pub from_address: String,
    pub to_address: String,
    pub amount: f64,
    pub timestamp: u64,
    pub hash: String,
}

impl Transaction {
    pub fn new(from_address: String, to_address: String, amount: f64) -> Result<Transaction, TransactionError> {
        if from_address.is_empty() || to_address.is_empty() {
            return Err(TransactionError::EmptyAddress);
        }
        if from_address == to_address && from_address != "genesisAddress" {
            return Err(TransactionError::SameAddress);
        }
        if amount <= 0.0 {
            return Err(TransactionError::InvalidAmount);
        }

        let timestamp = get_current_timestamp();
        let mut tx = Transaction {
            from_address,
            to_address,
            amount,
            timestamp,
            hash: String::new(),
        };
        tx.hash = tx.calculate_hash().map_err(|e| TransactionError::HashError(e))?; // Calcular el hash al crear la transacción

        Ok(tx)
    }

    pub fn calculate_hash(&self) -> Result<String, String> {
        let transaction_data = TransactionData {
            from_address: self.from_address.clone(),
            to_address: self.to_address.clone(),
            amount: self.amount,
            timestamp: self.timestamp,
        };
        calculate_hash(&transaction_data)
    }

    pub fn is_valid(&self) -> bool {
        if self.amount <= 0.0 {
            return false;
        }
        if self.from_address.is_empty() || self.to_address.is_empty() {
            return false;
        }
        self.are_addresses_valid()
    }

    fn are_addresses_valid(&self) -> bool {
        self.to_address != "genesisAddress" && !self.from_address.is_empty()
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TransactionData {
    pub from_address: String,
    pub to_address: String,
    pub amount: f64,
    pub timestamp: u64,
}

#[derive(Debug)]
pub enum TransactionError {
    EmptyAddress,
    SameAddress,
    InvalidAmount,
    HashError(String),
}

fn get_current_timestamp() -> u64 {
    Utc::now().timestamp_millis() as u64
}
