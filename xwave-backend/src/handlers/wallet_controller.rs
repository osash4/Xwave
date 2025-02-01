use actix_web::{HttpResponse, Responder, web};
use crate::services::wallet_service;


// Handler para obtener el saldo de la wallet
pub async fn get_wallet_balance() -> impl Responder {
    match wallet_service::get_wallet_balance().await {
        Ok(balance) => HttpResponse::Ok().json(balance),
        Err(_) => HttpResponse::InternalServerError().json("Error: retrieving balance"),
    }
}

// Handler para realizar una transacción
pub async fn transfer_funds(info: web::Json<TransferRequest>) -> impl Responder {
    let transfer_request = info.into_inner();
    match wallet_service::transfer(
        transfer_request.from_wallet,
        transfer_request.to_wallet,
        transfer_request.amount,
    ).await {
        Ok(transaction) => HttpResponse::Ok().json(transaction),
        Err(err) => HttpResponse::InternalServerError().body(format!("Error: {}", err)),
    }
}

// Estructura para la solicitud de transferencia
#[derive(serde::Deserialize)]
pub struct TransferRequest {
    from_wallet: String,
    to_wallet: String,
    amount: f64,
}