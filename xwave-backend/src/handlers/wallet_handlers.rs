use actix_web::{HttpResponse, Responder, web};
use crate::services::wallet_service;


// Handler para obtener la cuenta conectada
pub async fn get_wallet_session() -> impl Responder {
    match wallet_service::get_connected_account().await {
        Some(account) => HttpResponse::Ok().json(account),
        None => HttpResponse::NotFound().body("No hay cuenta conectada"),
    }
}

// Handler para conectar una cuenta
pub async fn connect_wallet(info: web::Json<String>) -> impl Responder {
    match wallet_service::connect_account(info.into_inner()).await {
        Ok(account) => HttpResponse::Ok().json(account),
        Err(err) => HttpResponse::InternalServerError().body(format!("Error: {}", err)),
    }
}

// Handler para desconectar una cuenta
pub async fn disconnect_wallet() -> impl Responder {
    match wallet_service::disconnect_account().await {
        Ok(_) => HttpResponse::Ok().body("Cuenta desconectada"),
        Err(err) => HttpResponse::InternalServerError().body(format!("Error: {}", err)),
    }
}


