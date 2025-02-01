use actix_web::web;

use crate::handlers::wallet_handler;

pub fn wallet_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/wallet")
            .route("/connect", web::post().to(wallet_handler::connect_wallet))
            .route("/disconnect", web::post().to(wallet_handler::disconnect_wallet))
            .route("/session", web::get().to(wallet_handler::get_wallet_session)),
    );
}
