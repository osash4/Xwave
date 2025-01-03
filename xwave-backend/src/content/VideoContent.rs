pub struct VideoContent {
  pub title: String,
  pub creator: String,
  pub price: f64,
  pub duration: u32,
  pub resolution: String,
  pub content_type: String,
}

impl VideoContent {
  pub fn new(title: String, creator: String, price: f64, duration: u32, resolution: String) -> Self {
      VideoContent {
          title,
          creator,
          price,
          duration,
          resolution,
          content_type: "video".to_string(),
      }
  }
}
