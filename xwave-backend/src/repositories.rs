// src/repositories.rs

use crate::models::models::{Wallet, Transaction};
use std::sync::{Arc, Mutex};  // Usamos Mutex para simular la sincronización de datos en este ejemplo

// Simulamos una base de datos en memoria usando un HashMap
lazy_static! {
    static ref DATABASE: Mutex<Vec<Wallet>> = Mutex::new(vec![]);
    static ref TRANSACTIONS: Mutex<Vec<Transaction>> = Mutex::new(vec![]);
}

// Función para obtener una wallet
pub async fn get_wallet() -> Result<Wallet, String> {
    let db = DATABASE.lock().unwrap();
    db.get(0).cloned().ok_or("Wallet not found".to_string()) // Retorna la primera wallet para este ejemplo
}

// Función para obtener una wallet por su ID
pub async fn get_wallet_by_id(id: &str) -> Result<Wallet, String> {
    let db = DATABASE.lock().unwrap();
    db.iter().find(|w| w.id == id).cloned().ok_or("Wallet not found".to_string())
}

// Función para actualizar una wallet
pub async fn update_wallet(wallet: &Wallet) -> Result<(), String> {
    let mut db = DATABASE.lock().unwrap();
    if let Some(existing_wallet) = db.iter_mut().find(|w| w.id == wallet.id) {
        existing_wallet.balance = wallet.balance;
        Ok(())
    } else {
        Err("Wallet not found".to_string())
    }
}

// Función para crear una transacción
pub async fn create_transaction(from_wallet_id: &str, to_wallet_id: &str, amount: f64) -> Result<Transaction, String> {
    let mut transactions = TRANSACTIONS.lock().unwrap();
    let transaction = Transaction {
        from_wallet: from_wallet_id.to_string(),
        to_wallet: to_wallet_id.to_string(),
        amount,
        timestamp: "2025-01-01T00:00:00Z".to_string(), // Timestamp de ejemplo
    };
    transactions.push(transaction.clone());
    Ok(transaction)
}
