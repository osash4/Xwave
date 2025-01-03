use rocket::{post, get, routes, serde::json::Json};
use rocket::tokio::fs;
use rocket_multipart_form_data::{MultipartFormData, MultipartFormDataOptions, FileField};
use rocket::data::{ByteUnit, Data};
use rocket::serde::{Serialize, Deserialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize)]
struct ContentMetadata {
    title: String,
    creator: String,
    price: f64,
    duration: Option<u64>,
    resolution: Option<String>,
    genre: Option<String>,
    requirements: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct Content {
    content_type: String,
    metadata: ContentMetadata,
    file: Vec<u8>,
}

#[derive(Serialize, Deserialize)]
struct ContentResponse {
    content_id: String,
}

#[post("/upload", data = "<data>")]
async fn upload_content(mut data: Data<'_>, content: Json<ContentMetadata>) -> Json<ContentResponse> {
    // Process file upload
    let file_name = format!("{}-uploaded-file", content.metadata.title);  // File naming convention

    let file_data = data.open(ByteUnit::default()).into_bytes().await.unwrap();
    
    // Store file in the filesystem (for example)
    let file_path = format!("./uploads/{}", file_name);
    fs::write(file_path, file_data).await.unwrap();
    
    // Create content object based on the type (this would be more dynamic depending on actual types)
    let content_id = "generated-content-id".to_string(); // You'd replace this with actual content ID generation logic
    
    // Return a response with the content id
    Json(ContentResponse { content_id })
}

#[get("/<content_id>")]
async fn get_content(content_id: String) -> Json<Content> {
    // Retrieve content logic (assuming we're just returning a dummy content here)
    let content = Content {
        content_type: "video".to_string(),
        metadata: ContentMetadata {
            title: "Sample Video".to_string(),
            creator: "Artist".to_string(),
            price: 10.0,
            duration: Some(120),
            resolution: Some("1080p".to_string()),
            genre: None,
            requirements: None,
        },
        file: Vec::new(), // File data would typically be fetched from storage
    };
    Json(content)
}

#[get("/")]
async fn list_content() -> Json<Vec<String>> {
    // Retrieve a list of content IDs (dummy data here)
    Json(vec!["content1".to_string(), "content2".to_string()])
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/api", routes![upload_content, get_content, list_content])
}
