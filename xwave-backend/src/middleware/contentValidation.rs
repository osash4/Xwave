use actix_web::{Error, HttpResponse, web, Responder};
use serde::{Deserialize, Serialize};
use crate::utils::{validate_file, validate_content_metadata, upload_to_ipfs}; // Importamos funciones necesarias

#[derive(Deserialize, Serialize)]
pub struct ContentMetadata {
    title: String,
    creator: String,
    price: f64,
    content_type: String,
    description: String,
    tags: Option<Vec<String>>,
}

#[derive(Deserialize)]
pub struct ContentUploadRequest {
    file: Vec<u8>, // Asumimos que el archivo viene en bytes
    title: String,
    creator: String,
    price: f64,
    content_type: String,
    description: String,
    tags: Option<String>,
}

pub async fn validate_content_upload(
    req: web::Json<ContentUploadRequest>
) -> Result<HttpResponse, Error> {
    // Validar metadatos
    let metadata = ContentMetadata {
        title: req.title.clone(),
        creator: req.creator.clone(),
        price: req.price,
        content_type: req.content_type.clone(),
        description: req.description.clone(),
        tags: req.tags.clone().map(|tags| serde_json::from_str(&tags).unwrap_or_default()),
    };

    // Validar metadata
    validate_content_metadata(&metadata)?;

    // Validar archivo
    validate_file(&req.file, &metadata.content_type)?;

    // Subir el archivo a IPFS
    let ipfs_hash = upload_to_ipfs(&req.file).await?;

    // Añadir el hash de IPFS a los metadatos
    let metadata_with_ipfs = ContentMetadata {
        ipfs_hash,
        ..metadata
    };

    Ok(HttpResponse::Ok().json(metadata_with_ipfs))
}
