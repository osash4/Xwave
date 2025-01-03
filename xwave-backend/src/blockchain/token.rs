use std::collections::HashMap;

pub struct Token {
    balances: HashMap<String, f64>,  // Almacenamos los balances de los usuarios
    royalties: HashMap<String, f64>, // Regalías acumuladas para artistas
    nfts: HashMap<String, NFT>,      // NFTs emitidos por los artistas
    governance: HashMap<String, f64>, // Gobernanza descentralizada: votos de los usuarios
}

#[derive(Clone, Debug)]
pub struct NFT {
    content_id: String, // Representa el contenido (por ejemplo, canción, video)
    artist: String,     // Artista propietario
    royalty_percentage: f64, // Porcentaje de regalías para el artista
}

impl Token {
    // Constructor para crear un nuevo Token
    pub fn new() -> Token {
        Token {
            balances: HashMap::new(),
            royalties: HashMap::new(),
            nfts: HashMap::new(),
            governance: HashMap::new(),
        }
    }

    // Función para mintar (crear) nuevos tokens
    pub fn mint(&mut self, account: &str, amount: f64) -> Result<(), String> {
        if account.is_empty() || amount <= 0.0 {
            return Err("Cuenta inválida o cantidad menor a 0".to_string());
        }

        // Si la cuenta ya tiene saldo, aumentamos el balance
        let current_balance = self.balances.entry(account.to_string()).or_insert(0.0);
        *current_balance += amount;

        Ok(())
    }

    // Función para mintar un NFT asociado a un contenido
    pub fn mint_nft(&mut self, artist: &str, content_id: &str, royalty_percentage: f64) -> Result<(), String> {
        if artist.is_empty() || content_id.is_empty() || royalty_percentage <= 0.0 || royalty_percentage > 100.0 {
            return Err("Datos inválidos para mintar el NFT".to_string());
        }

        let nft = NFT {
            content_id: content_id.to_string(),
            artist: artist.to_string(),
            royalty_percentage,
        };

        self.nfts.insert(content_id.to_string(), nft);

        Ok(())
    }

    // Función para transferir tokens entre cuentas con pago de regalías
    pub fn transfer(&mut self, from: &str, to: &str, amount: f64, content_id: &str) -> Result<bool, String> {
        if from.is_empty() || to.is_empty() || amount <= 0.0 {
            return Err("Las cuentas de origen y destino deben ser válidas y la cantidad debe ser mayor a 0".to_string());
        }

        // Verificar que la cuenta de origen tiene suficientes tokens
        let from_balance = match self.balances.get_mut(from) {
            Some(balance) => balance,
            None => return Err("Cuenta de origen no tiene tokens".to_string()),
        };

        if *from_balance < amount {
            return Err("Saldo insuficiente".to_string());
        }

        // Restamos de la cuenta de origen
        *from_balance -= amount;

        // Aseguramos que la cuenta destino tenga el saldo adecuado
        let to_balance = self.balances.entry(to.to_string()).or_insert(0.0);
        *to_balance += amount;

        // Verificar y calcular regalías
        if let Some(nft) = self.nfts.get(content_id) {
            let royalty_amount = amount * (nft.royalty_percentage / 100.0);
            let artist_balance = self.royalties.entry(nft.artist.clone()).or_insert(0.0);
            *artist_balance += royalty_amount;
        }

        Ok(true)
    }

    // Obtener el saldo de una cuenta
    pub fn balance_of(&self, account: &str) -> f64 {
        *self.balances.get(account).unwrap_or(&0.0)
    }

    // Verifica si la cuenta tiene un saldo suficiente
    pub fn has_balance(&self, account: &str, amount: f64) -> bool {
        self.balance_of(account) >= amount
    }

    // Obtener regalías acumuladas para un artista
    pub fn royalties_of(&self, artist: &str) -> f64 {
        *self.royalties.get(artist).unwrap_or(&0.0)
    }

    // Función para permitir a los usuarios votar en la gobernanza
    pub fn vote(&mut self, account: &str, proposal_id: &str) -> Result<(), String> {
        if account.is_empty() || proposal_id.is_empty() {
            return Err("Datos inválidos para votar".to_string());
        }

        let vote_weight = self.balance_of(account);
        if vote_weight <= 0.0 {
            return Err("El usuario debe tener tokens para votar".to_string());
        }

        // Registrar el voto del usuario con el peso correspondiente
        self.governance.entry(proposal_id.to_string()).or_insert(0.0);
        let current_votes = self.governance.get_mut(proposal_id).unwrap();
        *current_votes += vote_weight;

        Ok(())
    }

    // Obtener votos para una propuesta
    pub fn get_votes(&self, proposal_id: &str) -> f64 {
        *self.governance.get(proposal_id).unwrap_or(&0.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // Test para el método mint
    #[test]
    fn test_mint_tokens() {
        let mut token = Token::new();
        
        // Mintamos 100 tokens para una cuenta
        token.mint("account1", 100.0).unwrap();

        // Verificamos que el saldo sea 100
        assert_eq!(token.balance_of("account1"), 100.0);
    }

    // Test para el método mint de NFT
    #[test]
    fn test_mint_nft() {
        let mut token = Token::new();

        // Mintamos un NFT para un artista
        token.mint_nft("artist1", "song1", 10.0).unwrap();

        // Verificamos que el NFT fue creado correctamente
        assert_eq!(token.nfts.get("song1").unwrap().artist, "artist1");
        assert_eq!(token.nfts.get("song1").unwrap().royalty_percentage, 10.0);
    }

    // Test para el método transfer
    #[test]
    fn test_transfer_tokens() {
        let mut token = Token::new();
        
        // Mintamos tokens y NFTs
        token.mint("account1", 100.0).unwrap();
        token.mint("account2", 50.0).unwrap();
        token.mint_nft("artist1", "song1", 10.0).unwrap();
        
        // Transferimos 30 tokens de account1 a account2
        token.transfer("account1", "account2", 30.0, "song1").unwrap();
        
        // Verificamos los balances después de la transferencia
        assert_eq!(token.balance_of("account1"), 70.0);
        assert_eq!(token.balance_of("account2"), 80.0);

        // Verificamos las regalías del artista
        assert_eq!(token.royalties_of("artist1"), 3.0); // 10% de 30
    }

    // Test para la función de gobernanza
    #[test]
    fn test_governance() {
        let mut token = Token::new();
        
        // Mintamos tokens para votar
        token.mint("account1", 100.0).unwrap();
        
        // Los usuarios votan
        token.vote("account1", "proposal1").unwrap();
        
        // Verificamos los votos para la propuesta
        assert_eq!(token.get_votes("proposal1"), 100.0);
    }
}
