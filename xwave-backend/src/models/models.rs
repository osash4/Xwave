// src/models.rs

use serde::{Deserialize, Serialize};  // Usamos serde para la serialización y deserialización

// Modelo para representar una wallet
#[derive(Serialize, Deserialize, Clone)]
pub struct Wallet {
    pub id: String,
    pub balance: f64,
}

// Modelo para representar una transacción
#[derive(Serialize, Deserialize, Clone)]
pub struct Transaction {
    pub from_wallet: String,
    pub to_wallet: String,
    pub amount: f64,
    pub timestamp: String,  // Podrías usar chrono o algún tipo de dato para el tiempo si es necesario
}
