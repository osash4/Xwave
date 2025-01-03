// src/tests.rs

#[cfg(test)]
mod tests {
    use super::*; // Importar Token para las pruebas

    fn setup() -> Token {
        Token::new()
    }

    #[test]
    fn test_mint() {
        let mut token = setup();
        let result = token.mint("address1", 100.0);
        assert!(result.is_ok());
        assert_eq!(token.balance_of("address1"), 100.0);
    }

    // Agrega más pruebas según sea necesario...
}
