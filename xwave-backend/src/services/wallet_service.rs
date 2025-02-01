use tokio::sync::Mutex;
use lazy_static::lazy_static;
use crate::models::models::{Wallet, Transaction};
use crate::handlers::wallet_repository;

// Sincronización de la cuenta conectada
lazy_static! {
    static ref CONNECTED_ACCOUNT: Mutex<Option<String>> = Mutex::new(None);
}

// Obtener la cuenta conectada
pub async fn get_connected_account() -> Option<String> {
    let account = CONNECTED_ACCOUNT.lock().await;
    account.clone()
}

// Conectar una cuenta
pub async fn connect_account(account: String) -> Result<String, String> {
    let mut connected_account = CONNECTED_ACCOUNT.lock().await;
    *connected_account = Some(account.clone());
    Ok(account)
}

// Desconectar una cuenta
pub async fn disconnect_account() -> Result<(), String> {
    let mut connected_account = CONNECTED_ACCOUNT.lock().await;
    *connected_account = None;
    Ok(())
}

// Obtener el saldo de la wallet
pub async fn get_wallet_balance() -> Result<f64, String> {
    match get_connected_account().await {
        Some(account_id) => {
            // Obtener la wallet de la cuenta conectada
            match wallet_repository::get_wallet_by_id(&account_id).await {
                Ok(wallet) => {
                    let _unused_wallet = Wallet { id: wallet.id.clone(), balance: wallet.balance };
                    Ok(wallet.balance)
                }
                Err(err) => Err(format!("Failed to retrieve wallet: {}", err)),
            }
        }
        None => Err("No connected account found".to_string()), // Si no hay cuenta conectada
    }
}

// Realizar una transferencia
pub async fn transfer(from_wallet: String, to_wallet: String, amount: f64) -> Result<Transaction, String> {
    // Validaciones iniciales
    if from_wallet.trim().is_empty() || to_wallet.trim().is_empty() {
        return Err("Wallet IDs cannot be empty".to_string());
    }

    if from_wallet == to_wallet {
        return Err("Source and destination wallets cannot be the same".to_string());
    }

    if amount <= 0.0 {
        return Err("Amount must be greater than 0".to_string());
    }

    // Obtener wallets
    let mut from_wallet = wallet_repository::get_wallet_by_id(&from_wallet)
        .await
        .map_err(|_| "From wallet not found".to_string())?;

    let mut to_wallet = wallet_repository::get_wallet_by_id(&to_wallet)
        .await
        .map_err(|_| "To wallet not found".to_string())?;

    if from_wallet.balance < amount {
        return Err("Insufficient balance".to_string());
    }

    // Actualizar saldos
    from_wallet.balance -= amount;
    to_wallet.balance += amount;

    wallet_repository::update_wallet(&from_wallet)
        .await
        .map_err(|e| format!("Failed to update from wallet: {}", e))?;

    wallet_repository::update_wallet(&to_wallet)
        .await
        .map_err(|e| format!("Failed to update to wallet: {}", e))?;

    // Registrar la transacción
    wallet_repository::create_transaction(&from_wallet.id, &to_wallet.id, amount)
        .await
        .map_err(|e| format!("Failed to create transaction: {}", e))
}
