use actix_web::{web, App, HttpServer, Responder, HttpResponse, middleware::Logger};
use actix_web_actors::ws::{self, Message, ProtocolError};
use actix::Actor;
use actix::StreamHandler;
use actix_cors::Cors;
use futures::future;
use jsonrpc_http_server::jsonrpc_core::{IoHandler, Params, Value};
use jsonrpc_http_server::{ServerBuilder, DomainsValidation, AccessControlAllowOrigin};
use std::sync::{Arc, Mutex};
use std::net::SocketAddr;
use serde::{Serialize, Deserialize};
use crate::blockchain::blockchain::Blockchain;
mod blockchain;
mod handlers;
pub mod services;
mod models;
use handlers::wallet_controller;
pub mod utils;
use crate::handlers::wallet_handlers::{get_wallet_session, connect_wallet, disconnect_wallet};


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

// Rutas del servidor HTTP
async fn system_health() -> impl Responder {
    HttpResponse::Ok().json(Response { message: "Health System".to_string() })
}

async fn get_balance(path: web::Path<String>) -> impl Responder {
    let address = path.into_inner();
    HttpResponse::Ok().json(Response { message: format!("Balance para la dirección: {}", address) })
}

async fn post_transaction(web::Json(transaction): web::Json<Transaction>) -> impl Responder {
    HttpResponse::Ok().json(Response { message: format!(
        "Transferencia de {} tokens de {} a {} realizada con éxito.",
        transaction.amount, transaction.sender, transaction.receiver
    ) })
}

async fn auth_login(web::Json(auth): web::Json<Auth>) -> impl Responder {
    HttpResponse::Ok().json(Response { message: format!(
        "Usuario autenticado con dirección: {} y firma: {}.",
        auth.address, auth.signature
    ) })
}

// WebSocket handler
struct MyWebSocket;

impl MyWebSocket {
    fn on_message(&mut self, msg: Message, ctx: &mut ws::WebsocketContext<Self>) {
        println!("Mensaje recibido: {:?}", msg);
        ctx.text("Mensaje recibido correctamente");
    }
}

impl Actor for MyWebSocket {
    type Context = ws::WebsocketContext<Self>;
}

impl StreamHandler<Result<Message, ProtocolError>> for MyWebSocket {
    fn handle(&mut self, msg: Result<Message, ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(message) => self.on_message(message, ctx),
            Err(_) => ctx.close(None),
        }
    }
}

async fn ws_handler(req: actix_web::HttpRequest, stream: web::Payload) -> Result<HttpResponse, actix_web::Error> {
    ws::start(MyWebSocket, &req, stream)
}

// Configuración de servidor RPC
async fn start_rpc_server(blockchain: Arc<Mutex<Blockchain>>) -> std::io::Result<()> {
    let blockchain = blockchain.clone();

    let mut io = IoHandler::new();
    
    io.add_method("get_balance", move |params: Params| {
        match params.parse::<String>() {
            Ok(address) => {
                let blockchain = blockchain.lock().unwrap();
                let balance = blockchain.get_balance(&address); 
                future::ready(Ok(Value::String(format!(
                    "Balance para la dirección: {} es: {}", address, balance
                ))))
            }
            Err(e) => future::ready(Err(jsonrpc_http_server::jsonrpc_core::Error::invalid_params(format!(
                "Error al parsear la dirección: {}", e
            )))),
        }
    });

    io.add_method("auth_login", move |params: Params| {
        match params.parse::<Auth>() {
            Ok(auth) => future::ready(Ok(Value::String(format!(
                "Usuario autenticado con dirección: {} y firma: {}.",
                auth.address, auth.signature
            )))),
            Err(e) => future::ready(Err(jsonrpc_http_server::jsonrpc_core::Error::invalid_params(format!("Error al parsear los parámetros de autenticación: {}", e)))),
        }
    });

    io.add_method("post_transaction", move |params: Params| {
        match params.parse::<Transaction>() {
            Ok(transaction) => future::ready(Ok(Value::String(format!(
                "Transferencia de {} tokens de {} a {} realizada con éxito.",
                transaction.amount, transaction.sender, transaction.receiver
            )))),
            Err(e) => future::ready(Err(jsonrpc_http_server::jsonrpc_core::Error::invalid_params(format!("Error al parsear la transacción: {}", e)))),
        }
    });

    let server = ServerBuilder::new(io)
        .threads(3)
        .cors(DomainsValidation::AllowOnly(vec![AccessControlAllowOrigin::Any]))
        .start_http(&SocketAddr::from(([127, 0, 0, 1], 3030)))
        .expect("Error al iniciar el servidor RPC");

    server.wait();
    Ok(())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Arrancando servidor...");

    // Crear una instancia de Blockchain y envolverla en Arc y Mutex
    let blockchain = Arc::new(Mutex::new(Blockchain::new()));

    // Iniciar servidor RPC
    if let Err(e) = start_rpc_server(Arc::clone(&blockchain)).await {
        eprintln!("Error al iniciar el servidor RPC: {}", e);
    }

    // Configuración del servidor HTTP
    HttpServer::new(|| {
        App::new()
            .route("/wallet/session", web::get().to(get_wallet_session))
            .route("/wallet/connect", web::post().to(connect_wallet))
            .route("/wallet/disconnect", web::post().to(disconnect_wallet))
            .route("/wallet/balance", web::get().to(wallet_controller::get_wallet_balance))
            .route("/wallet/transfer", web::post().to(wallet_controller::transfer_funds))
            .wrap(Logger::default()) // Log de solicitudes
            .app_data(web::JsonConfig::default().limit(4096)) // Configurar límites de JSON
            .configure(|cfg| {
                cfg.service(web::resource("/api/balance/{address}").route(web::get().to(get_balance)))
                    .service(web::resource("/api/transactions").route(web::post().to(post_transaction)))
                    .service(web::resource("/api/auth/login").route(web::post().to(auth_login)))
                    .service(web::resource("/api/system_health").route(web::get().to(system_health)))
                    .service(web::resource("/ws/").route(web::get().to(ws_handler)));
            })
            .wrap(
                Cors::permissive()
                    .allowed_origin("http://localhost:5173") // Origen permitido (por ejemplo, frontend)
                    .allowed_methods(vec!["GET", "POST", "OPTIONS"]) // Métodos permitidos
                    .allowed_headers(vec!["Content-Type"]) // Cabeceras permitidas
                    .supports_credentials() // Soporte de credenciales
            )
    })
    .bind("127.0.0.1:8083")?
    .run()
    .await
}
