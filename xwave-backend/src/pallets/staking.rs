use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};

// Definimos los tipos de eventos para Staking
#[derive(Debug)]
pub struct StakedEvent {
    pub address: String,
    pub amount: u64,
}

#[derive(Debug)]
pub struct UnstakedEvent {
    pub address: String,
    pub amount: u64,
}

#[derive(Debug)]
pub struct SlashedEvent {
    pub address: String,
    pub penalty: u64,
    pub reason: String,
}

#[derive(Debug)]
pub struct ValidatorDeactivatedEvent {
    pub address: String,
    pub reason: String,
}

// Definimos las interfaces para Royalty
#[derive(Debug)]
pub struct Beneficiary {
    pub address: String,
    pub share: u32, // Percentage (0-100)
}

#[derive(Debug)]
pub struct RoyaltyContract {
    pub content_id: String,
    pub beneficiaries: Vec<Beneficiary>,
    pub created_at: u64,
    pub status: String,
    pub total_earnings: u64,
}

#[derive(Debug)]
pub struct Distribution {
    pub address: String,
    pub amount: u64,
    pub timestamp: u64,
}

#[derive(Debug)]
pub struct PaymentRecord {
    pub content_id: String,
    pub total_amount: u64,
    pub distributions: Vec<Distribution>,
    pub timestamp: u64,
}

#[derive(Default)]
pub struct StakingPallet {
    stakes: HashMap<String, u64>,
    validators: HashMap<String, ValidatorInfo>,
    minimum_stake: u64,
}

#[derive(Default)]
pub struct RoyaltyPallet {
    royalties: HashMap<String, RoyaltyContract>,
    payment_history: HashMap<String, Vec<PaymentRecord>>,
}

#[derive(Default)]
pub struct ValidatorInfo {
    pub is_active: bool,
    pub last_validation: u64,
    pub total_validated: u64,
    pub slashes: u32,
}

impl StakingPallet {
    pub fn new() -> Self {
        StakingPallet {
            stakes: HashMap::new(),
            validators: HashMap::new(),
            minimum_stake: 1000,
        }
    }

    pub fn stake(&mut self, address: &str, amount: u64) -> Result<bool, String> {
        if amount <= 0 {
            return Err("Amount must be greater than zero".to_string());
        }

        let current_stake = self.stakes.get(address).cloned().unwrap_or(0);
        if current_stake + amount >= self.minimum_stake {
            self.stakes.insert(address.to_string(), current_stake + amount);

            if !self.validators.contains_key(address) {
                self.validators.insert(
                    address.to_string(),
                    ValidatorInfo {
                        is_active: true,
                        last_validation: 0,
                        total_validated: 0,
                        slashes: 0,
                    },
                );
            }

            // Emitir el evento "staked"
            println!("{:?}", StakedEvent {
                address: address.to_string(),
                amount,
            });

            Ok(true)
        } else {
            Ok(false)
        }
    }

    pub fn unstake(&mut self, address: &str, amount: u64) -> Result<bool, String> {
        let current_stake = self.stakes.get(address).cloned().unwrap_or(0);
        if current_stake - amount < self.minimum_stake {
            return Err("Remaining stake would be below minimum".to_string());
        }

        self.stakes.insert(address.to_string(), current_stake - amount);

        // Emitir el evento "unstaked"
        println!("{:?}", UnstakedEvent {
            address: address.to_string(),
            amount,
        });

        Ok(true)
    }

    pub fn slash(&mut self, address: &str, reason: &str) {
        let stake = self.stakes.get(address).cloned().unwrap_or(0);
        let penalty = stake * 50 / 100; // Penalización del 50%

        // Reducir el saldo
        self.stakes.insert(address.to_string(), stake - penalty);

        // Actualizar el estado del validador
        if let Some(validator) = self.validators.get_mut(address) {
            validator.slashes += 1;
            if validator.slashes >= 3 {
                validator.is_active = false;

                // Emitir el evento "validatorDeactivated"
                println!("{:?}", ValidatorDeactivatedEvent {
                    address: address.to_string(),
                    reason: reason.to_string(),
                });
            }
        }

        // Emitir el evento "slashed"
        println!("{:?}", SlashedEvent {
            address: address.to_string(),
            penalty,
            reason: reason.to_string(),
        });
    }

    pub fn is_validator(&self, address: &str) -> bool {
        self.validators.get(address).map_or(false, |v| v.is_active)
    }
}

impl RoyaltyPallet {
    pub fn new() -> Self {
        RoyaltyPallet {
            royalties: HashMap::new(),
            payment_history: HashMap::new(),
        }
    }

    pub fn create_royalty_contract(
        &mut self,
        content_id: &str,
        beneficiaries: Vec<Beneficiary>,
    ) -> Result<RoyaltyContract, String> {
        if beneficiaries.is_empty() {
            return Err("Invalid beneficiaries".to_string());
        }

        let total_share: u32 = beneficiaries.iter().map(|b| b.share).sum();
        if total_share != 100 {
            return Err("Total share must be 100%".to_string());
        }

        let unique_addresses: Vec<String> = beneficiaries
            .iter()
            .map(|b| b.address.clone())
            .collect();
        if unique_addresses.len() != unique_addresses.iter().collect::<std::collections::HashSet<_>>().len() {
            return Err("Beneficiaries must have unique addresses".to_string());
        }

        let contract = RoyaltyContract {
            content_id: content_id.to_string(),
            beneficiaries,
            created_at: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            status: "ACTIVE".to_string(),
            total_earnings: 0,
        };

        self.royalties.insert(content_id.to_string(), contract);

        // Emitir el evento "contractCreated"
        println!("{:?}", StakedEvent {
            address: content_id.to_string(),
            amount: 0,
        });

        Ok(contract)
    }

    pub fn distribute_royalties(
        &mut self,
        content_id: &str,
        amount: u64,
    ) -> Result<Vec<Distribution>, String> {
        let contract = self.royalties.get_mut(content_id);
        if contract.is_none() || contract.unwrap().status != "ACTIVE" {
            return Err("Invalid or inactive royalty contract".to_string());
        }

        let contract = contract.unwrap();
        let distributions: Vec<Distribution> = contract
            .beneficiaries
            .iter()
            .map(|beneficiary| Distribution {
                address: beneficiary.address.clone(),
                amount: (amount * beneficiary.share as u64) / 100,
                timestamp: SystemTime::now()
                    .duration_since(UNIX_EPOCH)
                    .unwrap()
                    .as_secs(),
            })
            .collect();

        // Registrar el historial de pagos
        if !self.payment_history.contains_key(content_id) {
            self.payment_history.insert(content_id.to_string(), Vec::new());
        }

        let payment_record = PaymentRecord {
            content_id: content_id.to_string(),
            total_amount: amount,
            distributions: distributions.clone(),
            timestamp: SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        };

        self.payment_history
            .get_mut(content_id)
            .unwrap()
            .push(payment_record);

        contract.total_earnings += amount;

        // Emitir el evento "royaltiesDistributed"
        println!("{:?}", StakedEvent {
            address: content_id.to_string(),
            amount: 0,
        });

        Ok(distributions)
    }
}
