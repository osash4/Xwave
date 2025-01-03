// src/blockchain/block.rs
use crate::blockchain::transaction::Transaction; // Asegúrate de importar la estructura Transaction
use crate::utils::crypto::calculate_hash; // Suponiendo que `calculate_hash` está en `utils/crypto.rs`

// Definir la estructura Block
pub struct Block {
    pub timestamp: u64,
    pub transactions: Vec<Transaction>, // Un vector de transacciones
    pub previous_hash: String,
    pub validator: String,
    pub hash: String,
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
            return Err("Block must contain at least one transaction".to_string());
        }

        // El validador se puede pasar, sino se deja como cadena vacía
        let validator = validator.unwrap_or_else(|| String::new());

        // Crear el bloque sin hash calculado
        let mut block = Block {
            timestamp,
            transactions,
            previous_hash,
            validator,
            hash: String::new(), // Inicialmente vacío
        };

        // Calcular el hash del bloque
        block.set_hash();

        Ok(block)
    }

    // Método para calcular el hash
    pub fn calculate_hash(&self) -> String {
        calculate_hash(
            &self.previous_hash,
            self.timestamp,
            &self.transactions,
            &self.validator,
        )
    }

    // Método para actualizar el hash
    pub fn set_hash(&mut self) {
        self.hash = self.calculate_hash();
    }
}
