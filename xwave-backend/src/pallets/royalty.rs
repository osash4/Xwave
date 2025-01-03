use std::collections::{HashMap, HashSet};
use std::sync::{Arc, Mutex};
use tokio::sync::broadcast;

#[derive(Debug, Clone)]
pub struct RoyaltyPallet {
    royalties: Arc<Mutex<HashMap<String, RoyaltyContract>>>,
    payment_history: Arc<Mutex<HashMap<String, Vec<PaymentRecord>>>>,
    event_sender: broadcast::Sender<String>, // Emisor de eventos
}

#[derive(Debug, Clone)]
pub struct RoyaltyContract {
    content_id: String,
    beneficiaries: Vec<Beneficiary>,
    created_at: u64,
    status: ContractStatus,
    total_earnings: f64,
}

#[derive(Debug, Clone)]
pub struct Beneficiary {
    address: String,
    share: f64, // Porcentaje (0-100)
}

#[derive(Debug, Clone)]
pub enum ContractStatus {
    Active,
    Inactive,
}

#[derive(Debug, Clone)]
pub struct Distribution {
    address: String,
    amount: f64,
    timestamp: u64,
}

#[derive(Debug, Clone)]
pub struct PaymentRecord {
    content_id: String,
    total_amount: f64,
    distributions: Vec<Distribution>,
    timestamp: u64,
}

impl RoyaltyPallet {
    pub fn new() -> Self {
        let (event_sender, _) = broadcast::channel(100);
        RoyaltyPallet {
            royalties: Arc::new(Mutex::new(HashMap::new())),
            payment_history: Arc::new(Mutex::new(HashMap::new())),
            event_sender,
        }
    }

    pub async fn create_royalty_contract(
        &self,
        content_id: String,
        beneficiaries: Vec<Beneficiary>,
    ) -> Result<RoyaltyContract, String> {
        if beneficiaries.is_empty() {
            return Err("Invalid beneficiaries".to_string());
        }

        // Validar que las participaciones sumen 100
        let total_share: f64 = beneficiaries.iter().map(|b| b.share).sum();
        if total_share != 100.0 {
            return Err("Total share must be 100%".to_string());
        }

        // Validar que las direcciones sean únicas
        let addresses: HashSet<String> = beneficiaries.iter().map(|b| b.address.clone()).collect();
        if addresses.len() != beneficiaries.len() {
            return Err("Beneficiaries must have unique addresses".to_string());
        }

        let contract = RoyaltyContract {
            content_id: content_id.clone(),
            beneficiaries,
            created_at: get_current_timestamp(),
            status: ContractStatus::Active,
            total_earnings: 0.0,
        };

        self.royalties.lock().unwrap().insert(content_id.clone(), contract.clone());

        // Emitir el evento
        self.emit_event("contractCreated", &content_id);

        Ok(contract)
    }

    pub async fn distribute_royalties(
        &self,
        content_id: String,
        amount: f64,
    ) -> Result<Vec<Distribution>, String> {
        let mut royalties = self.royalties.lock().unwrap();

        let contract = royalties.get_mut(&content_id);
        if contract.is_none() || contract.unwrap().status != ContractStatus::Active {
            return Err("Invalid or inactive royalty contract".to_string());
        }

        let contract = contract.unwrap();
        let distributions: Vec<Distribution> = contract
            .beneficiaries
            .iter()
            .map(|beneficiary| Distribution {
                address: beneficiary.address.clone(),
                amount: (amount * beneficiary.share) / 100.0,
                timestamp: get_current_timestamp(),
            })
            .collect();

        // Registrar el historial de pagos
        let mut payment_history = self.payment_history.lock().unwrap();
        let payment_record = PaymentRecord {
            content_id: content_id.clone(),
            total_amount: amount,
            distributions: distributions.clone(),
            timestamp: get_current_timestamp(),
        };

        payment_history
            .entry(content_id.clone())
            .or_insert_with(Vec::new)
            .push(payment_record);

        contract.total_earnings += amount;

        // Emitir el evento
        self.emit_event("royaltiesDistributed", &content_id);

        Ok(distributions)
    }

    pub fn get_payment_history(&self, content_id: &str) -> Vec<PaymentRecord> {
        self.payment_history
            .lock()
            .unwrap()
            .get(content_id)
            .cloned()
            .unwrap_or_default()
    }

    pub fn get_beneficiary_earnings(&self, content_id: &str, address: &str) -> f64 {
        let history = self.payment_history.lock().unwrap();
        history
            .get(content_id)
            .unwrap_or(&Vec::new())
            .iter()
            .fold(0.0, |total, payment| {
                total
                    + payment
                        .distributions
                        .iter()
                        .find(|d| d.address == address)
                        .map(|d| d.amount)
                        .unwrap_or(0.0)
            })
    }

    fn emit_event(&self, event: &str, content_id: &str) {
        let message = format!("Event: {}, Content ID: {}", event, content_id);
        let _ = self.event_sender.send(message);
    }
}

fn get_current_timestamp() -> u64 {
    // Devuelve el timestamp actual en milisegundos
    chrono::Utc::now().timestamp_millis() as u64
}

#[tokio::main]
async fn main() {
    let royalty_pallet = RoyaltyPallet::new();

    // Crear un contrato de regalías
    let beneficiaries = vec![
        Beneficiary {
            address: "address1".to_string(),
            share: 50.0,
        },
        Beneficiary {
            address: "address2".to_string(),
            share: 50.0,
        },
    ];

    let contract = royalty_pallet
        .create_royalty_contract("content123".to_string(), beneficiaries)
        .await
        .unwrap();

    println!("{:?}", contract);

    // Distribuir regalías
    let distributions = royalty_pallet
        .distribute_royalties("content123".to_string(), 100.0)
        .await
        .unwrap();

    println!("{:?}", distributions);

    // Obtener historial de pagos
    let history = royalty_pallet.get_payment_history("content123");
    println!("{:?}", history);

    // Obtener ganancias de un beneficiario
    let earnings = royalty_pallet.get_beneficiary_earnings("content123", "address1");
    println!("Earnings: {}", earnings);
}
