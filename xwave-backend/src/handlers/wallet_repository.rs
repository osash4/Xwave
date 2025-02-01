use crate::models::models::{Wallet, Transaction};
use std::collections::HashMap;
use std::sync::Mutex;
use lazy_static::lazy_static;
use chrono::Local;

lazy_static! {
    static ref WALLETS: Mutex<HashMap<String, Wallet>> = Mutex::new(HashMap::new());
}

// Obtener una wallet por ID
pub async fn get_wallet_by_id(wallet_id: &str) -> Result<Wallet, String> {
    let wallets = WALLETS.lock().unwrap();
    match wallets.get(wallet_id) {
        Some(wallet) => Ok(wallet.clone()),
        None => Err("Wallet not found".to_string()),
    }
}

// Actualizar una wallet
pub async fn update_wallet(wallet: &Wallet) -> Result<(), String> {
    let mut wallets = WALLETS.lock().unwrap();
    if wallets.contains_key(&wallet.id) {
        wallets.insert(wallet.id.clone(), wallet.clone());
        Ok(())
    } else {
        Err("Wallet not found".to_string())
    }
}

// Crear una transacción
pub async fn create_transaction(from_wallet: &str, to_wallet: &str, amount: f64) -> Result<Transaction, String> {
    let mut wallets = WALLETS.lock().unwrap();

    // Primero, obtenemos copias de las wallets para evitar el doble préstamo mutable
    let sender_wallet = wallets.get(from_wallet).cloned();
    let receiver_wallet = wallets.get(to_wallet).cloned();

    match (sender_wallet, receiver_wallet) {
        (Some(mut sender), Some(mut receiver)) => {
            if sender.balance < amount {
                return Err("Insufficient funds".to_string());
            }

            // Actualizar balances en las copias
            sender.balance -= amount;
            receiver.balance += amount;

            // Reinsertar las wallets actualizadas en el HashMap
            wallets.insert(sender.id.clone(), sender);
            wallets.insert(receiver.id.clone(), receiver);

            // Crear transacción
            let transaction = Transaction {
                from_wallet: from_wallet.to_string(),
                to_wallet: to_wallet.to_string(),
                amount,
                timestamp: Local::now().to_string(),
            };

            Ok(transaction)
        }
        _ => Err("One or both wallets not found".to_string()),
    }
}
