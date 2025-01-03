use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};
use sha2::{Sha256, Digest};

#[derive(Clone, Debug)]
pub struct Transaction {
    pub from: String,
    pub to: String,
    pub amount: u64,
    pub nft_id: Option<String>, // Si la transacción es de un NFT, tendrá un ID
}

impl Transaction {
    fn is_valid(&self) -> bool {
        !self.from.is_empty() && !self.to.is_empty() && self.amount > 0
    }
}

#[derive(Clone, Debug)]
pub struct NFT {
    pub id: String,
    pub creator: String,
    pub owner: String,
    pub price: u64,
    pub ipfs_hash: Option<String>, // El hash de IPFS para el contenido asociado al NFT
}

pub struct Block {
    pub timestamp: u64,
    pub transactions: Vec<Transaction>,
    pub previous_hash: String,
    pub hash: String,
    pub validator: Option<String>,
}

impl Block {
    fn calculate_hash(&self) -> String {
        let data = format!("{:?}{:?}{:?}{:?}", self.timestamp, self.transactions, self.previous_hash, self.validator);
        let mut hasher = Sha256::new();
        hasher.update(data);
        let result = hasher.finalize();
        format!("{:x}", result)
    }
}

pub struct Blockchain {
    pub chain: Vec<Block>,
    pub pending_transactions: Vec<Transaction>,
    pub validators: HashMap<String, u64>,
    pub minimum_stake: u64,
    pub balances: HashMap<String, u64>,
    pub nft_registry: HashMap<String, NFT>, // Registro de NFTs
    pub proposals: HashMap<String, Proposal>, // Propuestas de gobernanza
    pub transaction_fees: u64, // Tarifa por transacción
}

#[derive(Clone, Debug)]
pub struct Proposal {
    pub description: String,
    pub votes_for: u64,
    pub votes_against: u64,
    pub end_time: u64, // Fecha de finalización de la votación
}

impl Blockchain {
    pub fn new() -> Self {
        let mut blockchain = Blockchain {
            chain: vec![Blockchain::create_genesis_block()],
            pending_transactions: Vec::new(),
            validators: HashMap::new(),
            minimum_stake: 1000,
            balances: HashMap::new(),
            nft_registry: HashMap::new(),
            proposals: HashMap::new(),
            transaction_fees: 10, // Ejemplo de tarifa por transacción
        };
        
        blockchain
    }

    fn create_genesis_block() -> Block {
        let genesis_address = "0x0000000000000000000000000000000000000000".to_string();
        let recipient_address = "XW1111111111111111111111111111111111111111".to_string();
        
        let genesis_transaction = Transaction {
            from: genesis_address.clone(),
            to: recipient_address.clone(),
            amount: 1,
            nft_id: None,
        };

        let mut balances = HashMap::new();
        balances.insert(genesis_address.clone(), 1000);
        balances.insert(recipient_address, 0);

        let mut block = Block {
            timestamp: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
            transactions: vec![genesis_transaction],
            previous_hash: "0".to_string(),
            hash: "".to_string(),
            validator: None,
        };

        block.hash = block.calculate_hash(); // Calcular el hash del bloque génesis

        block
    }

    pub fn get_latest_block(&self) -> &Block {
        self.chain.last().unwrap()
    }

    pub fn add_validator(&mut self, address: String, stake: u64) -> bool {
        if stake >= self.minimum_stake {
            self.validators.insert(address.clone(), stake);
            true
        } else {
            false
        }
    }

    pub fn add_nft(&mut self, creator: String, price: u64, ipfs_hash: Option<String>) -> String {
        let nft_id = format!("NFT{}", self.nft_registry.len() + 1);
        let nft = NFT {
            id: nft_id.clone(),
            creator: creator.clone(),
            owner: creator,
            price,
            ipfs_hash,
        };

        self.nft_registry.insert(nft_id.clone(), nft);
        nft_id
    }

    pub fn buy_nft(&mut self, buyer: String, nft_id: String) -> Result<(), String> {
        let nft = self.nft_registry.get_mut(&nft_id).ok_or("NFT no encontrado")?;
        if self.balances.get(&buyer).unwrap_or(&0) < &(nft.price + self.transaction_fees) {
            return Err("Saldo insuficiente".to_string());
        }

        // Transferir la propiedad y cobrar la tarifa
        let seller = nft.owner.clone();
        self.balances.entry(buyer.clone()).and_modify(|e| *e -= nft.price + self.transaction_fees).or_insert(0);
        self.balances.entry(seller).and_modify(|e| *e += nft.price).or_insert(0);

        nft.owner = buyer;

        // Registrar la transacción de compra de NFT
        let transaction = Transaction {
            from: buyer.clone(),
            to: seller,
            amount: nft.price,
            nft_id: Some(nft_id),
        };
        self.pending_transactions.push(transaction);

        Ok(())
    }

    pub fn mine_pending_transactions(&mut self) -> Result<Block, String> {
        if self.validators.is_empty() {
            return Err("No hay validadores disponibles".to_string());
        }

        let validator_address = self.get_validator_with_highest_stake();
        let mut block = Block {
            timestamp: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
            transactions: self.pending_transactions.clone(),
            previous_hash: self.get_latest_block().hash.clone(),
            hash: "".to_string(),
            validator: Some(validator_address.clone()),
        };

        block.hash = block.calculate_hash();
        self.chain.push(block.clone());
        self.pending_transactions.clear();

        // Recompensar al validador
        self.balances.entry(validator_address.clone())
            .and_modify(|e| *e += 1)
            .or_insert(1);

        Ok(block)
    }

    pub fn add_transaction(&mut self, transaction: Transaction) -> Result<(), String> {
        if !transaction.is_valid() {
            return Err("Transacción inválida".to_string());
        }

        let sender_balance = self.balances.get(&transaction.from).cloned().unwrap_or(0);
        if sender_balance < transaction.amount {
            return Err("Saldo insuficiente".to_string());
        }

        self.balances.insert(transaction.from.clone(), sender_balance - transaction.amount);
        let receiver_balance = self.balances.get(&transaction.to).cloned().unwrap_or(0);
        self.balances.insert(transaction.to.clone(), receiver_balance + transaction.amount);

        self.pending_transactions.push(transaction);
        Ok(())
    }

    fn get_validator_with_highest_stake(&self) -> String {
        self.validators.iter().max_by_key(|entry| entry.1).map(|entry| entry.0.clone()).unwrap_or_default()
    }

    pub fn propose_governance(&mut self, proposal_id: String, description: String, duration: u64) {
        let proposal = Proposal {
            description,
            votes_for: 0,
            votes_against: 0,
            end_time: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() + duration,
        };
        self.proposals.insert(proposal_id, proposal);
    }

    pub fn vote_on_proposal(&mut self, validator_address: String, proposal_id: String, vote: bool) -> Result<(), String> {
        let proposal = self.proposals.get_mut(&proposal_id).ok_or("Propuesta no encontrada")?;
        
        if !self.validators.contains_key(&validator_address) {
            return Err("No es un validador".to_string());
        }

        // Verificar si la propuesta ha expirado
        if SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs() > proposal.end_time {
            return Err("La propuesta ha expirado".to_string());
        }

        if vote {
            proposal.votes_for += 1;
        } else {
            proposal.votes_against += 1;
        }

        Ok(())
    }

    pub fn is_chain_valid(&self) -> bool {
        for i in 1..self.chain.len() {
            let current_block = &self.chain[i];
            let previous_block = &self.chain[i - 1];

            if current_block.hash != current_block.calculate_hash() {
                return false;
            }

            if current_block.previous_hash != previous_block.hash {
                return false;
            }
        }
        true
    }
}
