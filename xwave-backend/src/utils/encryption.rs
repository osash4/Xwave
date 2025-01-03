use aes::{Aes256, BlockCipher, NewBlockCipher};
use block_modes::{BlockMode, Cbc};
use block_modes::block_padding::Pkcs7;
use rand::Rng;
use hex::{encode, decode};
use std::error::Error;

type Aes256Cbc = Cbc<Aes256, Pkcs7>;

pub struct ContentEncryption;

impl ContentEncryption {
    // Encriptar contenido
    pub fn encrypt(content: &str, access_key: &str) -> Result<(String, String), Box<dyn Error>> {
        // Generar una clave de contenido aleatoria
        let content_key = ContentEncryption::generate_random_key();
        
        // Encriptar el contenido con la clave de contenido
        let encrypted_content = ContentEncryption::aes_encrypt(content, &content_key)?;
        
        // Encriptar la clave de contenido con la clave de acceso
        let encrypted_key = ContentEncryption::aes_encrypt(&content_key, access_key)?;
        
        Ok((encrypted_content, encrypted_key))
    }

    // Desencriptar contenido
    pub fn decrypt(encrypted_content: &str, encrypted_key: &str, access_key: &str) -> Result<String, Box<dyn Error>> {
        // Desencriptar la clave de contenido con la clave de acceso
        let content_key = ContentEncryption::aes_decrypt(encrypted_key, access_key)?;

        // Desencriptar el contenido con la clave de contenido
        let decrypted_content = ContentEncryption::aes_decrypt(encrypted_content, &content_key)?;

        Ok(decrypted_content)
    }

    // Generar una clave de acceso aleatoria
    pub fn generate_access_key() -> String {
        let key = ContentEncryption::generate_random_key();
        encode(&key)
    }

    // Función para generar una clave aleatoria
    fn generate_random_key() -> Vec<u8> {
        let mut rng = rand::thread_rng();
        let mut key = vec![0u8; 32]; // AES-256 necesita una clave de 32 bytes
        rng.fill(&mut key[..]);
        key
    }

    // Función de encriptación AES
    fn aes_encrypt(data: &str, key: &[u8]) -> Result<String, Box<dyn Error>> {
        let cipher = Aes256::new_from_slices(key, &key)?;
        let mut buffer = vec![0u8; data.len() + 16]; // Añadimos espacio para el padding
        let block_cipher = Cbc::<Aes256, Pkcs7>::new_from_slices(key, &key)?;
        let ciphertext = block_cipher.encrypt(&mut buffer, data.as_bytes())?;
        Ok(encode(ciphertext))
    }

    // Función de desencriptación AES
    fn aes_decrypt(data: &str, key: &[u8]) -> Result<String, Box<dyn Error>> {
        let data = decode(data)?;
        let cipher = Aes256::new_from_slices(key, &key)?;
        let block_cipher = Cbc::<Aes256, Pkcs7>::new_from_slices(key, &key)?;
        let decrypted_data = block_cipher.decrypt_vec(&data)?;
        Ok(String::from_utf8(decrypted_data)?)
    }
}

fn main() {
    let content = "Este es el contenido secreto";
    let access_key = ContentEncryption::generate_access_key();

    match ContentEncryption::encrypt(content, &access_key) {
        Ok((encrypted_content, encrypted_key)) => {
            println!("Encrypted content: {}", encrypted_content);
            println!("Encrypted key: {}", encrypted_key);

            // Desencriptar
            match ContentEncryption::decrypt(&encrypted_content, &encrypted_key, &access_key) {
                Ok(decrypted_content) => {
                    println!("Decrypted content: {}", decrypted_content);
                }
                Err(e) => {
                    eprintln!("Error decrypting: {}", e);
                }
            }
        }
        Err(e) => {
            eprintln!("Error encrypting: {}", e);
        }
    }
}
