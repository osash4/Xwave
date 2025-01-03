use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct Response {
    message: String,
}

#[derive(Serialize, Deserialize)]
struct Transaction {
    sender: String,
    receiver: String,
    amount: u32,
}

#[derive(Serialize, Deserialize)]
struct Auth {
    address: String,
    signature: String,
}

// Obtener balance para una dirección específica
async fn get_balance(path: web::Path<String>) -> impl Responder {
    let address = path.into_inner(); 
    HttpResponse::Ok().json(Response {
        message: format!("Balance para la dirección: {}", address),
    })
}

// Crear una nueva transacción
async fn post_transaction(web::Json(transaction): web::Json<Transaction>) -> impl Responder {
    HttpResponse::Ok().json(Response {
        message: format!(
            "Transferencia de {} tokens de {} a {} realizada con éxito.",
            transaction.amount, transaction.sender, transaction.receiver
        ),
    })
}

// Autenticación de usuario
async fn auth_login(web::Json(auth): web::Json<Auth>) -> impl Responder {
    HttpResponse::Ok().json(Response {
        message: format!(
            "Usuario autenticado con dirección: {} y firma: {}.",
            auth.address, auth.signature
        ),
    })
}

// Historial de transacciones
async fn get_transactions_history() -> impl Responder {
    HttpResponse::Ok().json(Response {
        message: "Historial de transacciones: (Este es un ejemplo)".to_string(),
    })
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Arrancando el servidor...");

    // Aquí se maneja la espera del servidor
    let server = HttpServer::new(|| {
        App::new()
            .route("/api/data", web::get().to(|| async {
                HttpResponse::Ok().json(Response {
                    message: "¡Datos desde el backend en Rust!".to_string(),
                })
            }))
            // Ruta para obtener el balance
            .route("/api/balance/{address}", web::get().to(get_balance))
            // Ruta para realizar transacciones
            .route("/api/transactions", web::post().to(post_transaction))
            // Ruta para obtener el historial de transacciones
            .route("/api/transactions/history", web::get().to(get_transactions_history))
            // Ruta para la autenticación
            .route("/api/auth/login", web::post().to(auth_login))
    })
    .bind("127.0.0.1:8083")?;

    // Aquí arranca el servidor
    server.run().await
}
