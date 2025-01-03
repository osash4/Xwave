pub struct MusicContent {
  pub title: String,
  pub creator: String,
  pub price: f64,
  pub duration: u32,
  pub genre: String,
  pub content_type: String,
}

impl MusicContent {
  pub fn new(title: String, creator: String, price: f64, duration: u32, genre: String) -> Self {
      MusicContent {
          title,
          creator,
          price,
          duration,
          genre,
          content_type: "music".to_string(),
      }
  }
}
