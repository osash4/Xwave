use rocket::{get, post, routes, serde::json::Json};
use rocket::serde::{Serialize, Deserialize};
use rocket::tokio::sync::RwLock;
use std::sync::Arc;

#[derive(Serialize, Deserialize)]
pub struct Transaction {
    from: String,
    to: String,
    amount: u64,
}

#[derive(Serialize, Deserialize)]
pub struct Validator {
    address: String,
    stake: u64,
}

#[derive(Serialize)]
pub struct Blockchain {
    chain: Vec<String>,  // Placeholder for the blockchain data structure
}

#[derive(Default)]
pub struct BlockchainState {
    pub blockchain: Arc<RwLock<Blockchain>>,
}

impl BlockchainState {
    fn new() -> Self {
        BlockchainState {
            blockchain: Arc::new(RwLock::new(Blockchain {
                chain: Vec::new(),
            })),
        }
    }
}

#[post("/transaction", format = "json", data = "<transaction>")]
async fn add_transaction(blockchain_state: &rocket::State<BlockchainState>, transaction: Json<Transaction>) -> Json<String> {
    // Validar las direcciones (puedes usar una expresión regular similar a la de TypeScript)
    let address_regex = regex::Regex::new(r"^XW[a-zA-Z0-9]{40}$").unwrap();

    if !address_regex.is_match(&transaction.from) || !address_regex.is_match(&transaction.to) {
        return Json("{\"error\": \"Invalid address format\"}".to_string());
    }

    // Aquí deberías agregar la transacción a la blockchain real
    let mut blockchain = blockchain_state.blockchain.write().await;
    blockchain.chain.push(format!("Transaction: {} -> {} amount: {}", transaction.from, transaction.to, transaction.amount));

    Json("{\"message\": \"Transaction added\"}".to_string())
}

#[post("/validator", format = "json", data = "<validator>")]
async fn add_validator(blockchain_state: &rocket::State<BlockchainState>, validator: Json<Validator>) -> Json<String> {
    let address_regex = regex::Regex::new(r"^XW[a-zA-Z0-9]{40}$").unwrap();

    if !address_regex.is_match(&validator.address) {
        return Json("{\"error\": \"Invalid validator address\"}".to_string());
    }

    // Lógica para agregar un validador a la blockchain (ejemplo simple)
    let mut blockchain = blockchain_state.blockchain.write().await;
    blockchain.chain.push(format!("Validator: {} with stake: {}", validator.address, validator.stake));

    Json("{\"message\": \"Validator added\"}".to_string())
}

#[get("/chain")]
async fn get_chain(blockchain_state: &rocket::State<BlockchainState>) -> Json<Blockchain> {
    let blockchain = blockchain_state.blockchain.read().await;
    Json(blockchain.clone())
}

#[get("/balance/<address>")]
async fn get_balance(blockchain_state: &rocket::State<BlockchainState>, address: String) -> Json<String> {
    let address_regex = regex::Regex::new(r"^XW[a-zA-Z0-9]{40}$").unwrap();

    if !address_regex.is_match(&address) {
        return Json("{\"error\": \"Invalid address format\"}".to_string());
    }

    // Aquí puedes agregar la lógica para obtener el balance real de la dirección
    let balance = 1000; // Ejemplo de balance ficticio

    Json(format!("{{\"address\": \"{}\", \"balance\": {}}}", address, balance))
}

#[post("/transfer", format = "json", data = "<transaction>")]
async fn transfer(blockchain_state: &rocket::State<BlockchainState>, transaction: Json<Transaction>) -> Json<String> {
    let address_regex = regex::Regex::new(r"^XW[a-zA-Z0-9]{40}$").unwrap();

    if !address_regex.is_match(&transaction.from) || !address_regex.is_match(&transaction.to) {
        return Json("{\"error\": \"Invalid address format\"}".to_string());
    }

    // Aquí deberías agregar la lógica para realizar la transferencia
    let mut blockchain = blockchain_state.blockchain.write().await;
    blockchain.chain.push(format!("Transfer: {} -> {} amount: {}", transaction.from, transaction.to, transaction.amount));

    Json("{\"message\": \"Transfer successful\"}".to_string())
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .manage(BlockchainState::new()) // Compartir el estado de la blockchain
        .mount(
            "/api",
            routes![
                add_transaction,
                add_validator,
                get_chain,
                get_balance,
                transfer,
            ],
        )
}
