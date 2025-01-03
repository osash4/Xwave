// tests/token_integration_tests.rs
use xwave_backend::Token;  // Asegúrate de que el nombre del paquete esté correcto

#[test]
fn test_integration() {
    let mut token = Token::new();

    // Mintamos tokens
    token.mint("account1", 100.0).unwrap();
    token.mint("account2", 50.0).unwrap();
    
    // Transferimos tokens
    token.transfer("account1", "account2", 30.0).unwrap();
    
    // Verificamos los balances finales
    assert_eq!(token.balance_of("account1"), 70.0);
    assert_eq!(token.balance_of("account2"), 80.0);
    
    // Verificamos el saldo de las cuentas
    assert!(token.has_balance("account1", 70.0));
    assert!(token.has_balance("account2", 80.0));
}
