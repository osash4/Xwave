use chrono::{DateTime, Local};
use chrono::format::strftime;

pub fn format_date(timestamp: i64) -> String {
    // Convertir el timestamp a DateTime
    let datetime = Local.timestamp(timestamp, 0);

    // Formatear la fecha como en 'en-US' (mes, día, año, hora, minuto)
    let formatted_date = datetime.format("%B %d, %Y, %I:%M %p").to_string();

    formatted_date
}

fn main() {
    let timestamp = 1633065600000; // Ejemplo de timestamp en milisegundos
    let formatted = format_date(timestamp / 1000); // Rust maneja los timestamps en segundos
    println!("Formatted Date: {}", formatted);
}
