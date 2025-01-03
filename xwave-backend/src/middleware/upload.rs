use ipfs_api::IpfsClient;
use actix_web::{Error, HttpResponse};
use crate::utils::validate_file;

pub async fn upload_to_ipfs(file: &[u8]) -> Result<String, Error> {
    let client = IpfsClient::default();

    let res = client.add(file).await;
    
    match res {
        Ok(response) => {
            let ipfs_hash = response.hash.to_string(); // Obtén el hash del archivo en IPFS
            Ok(ipfs_hash)
        },
        Err(e) => {
            Err(actix_web::error::ErrorInternalServerError(format!("Error uploading to IPFS: {}", e)))
        }
    }
}

pub async fn handle_upload(req: web::Json<ContentUploadRequest>) -> Result<HttpResponse, Error> {
    // Validamos y subimos el archivo a IPFS
    let ipfs_hash = upload_to_ipfs(&req.file).await?;
    Ok(HttpResponse::Ok().json(ipfs_hash))
}
