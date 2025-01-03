use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use md5;

#[derive(Clone)]
pub struct NFTPallet {
    tokens: Arc<Mutex<HashMap<String, NFTToken>>>,
    ownerships: Arc<Mutex<HashMap<String, String>>>,
    metadata: Arc<Mutex<HashMap<String, NFTMetadata>>>,
}

#[derive(Clone)]
pub struct NFTToken {
    id: String,
    creator: String,
    content_id: String,
    created_at: u64,
}

#[derive(Clone)]
pub struct NFTMetadata {
    title: String,
    description: String,
    content_type: String, // could be 'music', 'video', 'game'
    properties: HashMap<String, String>,
}

impl NFTPallet {
    pub fn new() -> Self {
        NFTPallet {
            tokens: Arc::new(Mutex::new(HashMap::new())),
            ownerships: Arc::new(Mutex::new(HashMap::new())),
            metadata: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub async fn mint_nft(
        &self,
        creator: String,
        content_id: String,
        metadata: NFTMetadata,
    ) -> Result<String, String> {
        if metadata.title.is_empty() || metadata.description.is_empty() {
            return Err("Metadata title and description must be provided".to_string());
        }

        let token_id = self.calculate_hash(&format!("{}-{}", content_id, SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis()));

        let token = NFTToken {
            id: token_id.clone(),
            creator,
            content_id,
            created_at: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
        };

        self.tokens.lock().unwrap().insert(token_id.clone(), token);
        self.ownerships.lock().unwrap().insert(token_id.clone(), creator);
        self.metadata.lock().unwrap().insert(token_id.clone(), metadata);

        // Simulate event emission
        println!("Minted: {:?}", token);

        Ok(token_id)
    }

    pub async fn transfer_nft(
        &self,
        from_address: String,
        to_address: String,
        token_id: String,
    ) -> Result<bool, String> {
        let current_owner = self.ownerships.lock().unwrap().get(&token_id);

        if current_owner != Some(&from_address) {
            return Err("Not token owner".to_string());
        }

        self.ownerships.lock().unwrap().insert(token_id.clone(), to_address);

        // Simulate event emission
        println!("Transferred: {} from {} to {}", token_id, from_address, to_address);

        Ok(true)
    }

    pub fn get_token_metadata(&self, token_id: String) -> Option<NFTMetadata> {
        self.metadata.lock().unwrap().get(&token_id).cloned()
    }

    pub fn get_token_owner(&self, token_id: String) -> Option<String> {
        self.ownerships.lock().unwrap().get(&token_id).cloned()
    }

    pub async fn burn_nft(
        &self,
        owner: String,
        token_id: String,
    ) -> Result<bool, String> {
        let current_owner = self.ownerships.lock().unwrap().get(&token_id);

        if current_owner != Some(&owner) {
            return Err("Not token owner".to_string());
        }

        if self.tokens.lock().unwrap().remove(&token_id).is_none() {
            return Err("Token does not exist".to_string());
        }

        self.ownerships.lock().unwrap().remove(&token_id);
        self.metadata.lock().unwrap().remove(&token_id);

        // Simulate event emission
        println!("Burned: {} by {}", token_id, owner);

        Ok(true)
    }

    fn calculate_hash(&self, input: &str) -> String {
        // Implement your hashing logic here (similar to calculateHash in JS)
        format!("{:x}", md5::compute(input))
    }
}

#[tokio::main]
async fn main() {
    let nft_pallet = NFTPallet::new();

    // Simulate minting an NFT
    let metadata = NFTMetadata {
        title: "My First NFT".to_string(),
        description: "This is a test NFT".to_string(),
        content_type: "music".to_string(),
        properties: HashMap::new(),
    };

    let token_id = nft_pallet
        .mint_nft("creator123".to_string(), "content123".to_string(), metadata)
        .await
        .unwrap();

    // Simulate transferring an NFT
    nft_pallet
        .transfer_nft("creator123".to_string(), "new_owner123".to_string(), token_id.clone())
        .await
        .unwrap();

    // Get token metadata
    let metadata = nft_pallet.get_token_metadata(token_id.clone());
    println!("{:?}", metadata);

    // Burn NFT
    nft_pallet.burn_nft("new_owner123".to_string(), token_id).await.unwrap();
}
