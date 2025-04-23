use std::fs;
use std::path::Path;
use dirs;

// Check for database file, create if not exist
pub fn init() {
    if !db_file_exists() {
        create_db_file();
    }
}

// Create the database file
fn create_db_file() {
    let db_path = get_db_path();
    let db_dir = Path::new(&db_path).parent().unwrap();

    // If parent directory does not exist
    if !db_dir.exists() {
        fs::create_dir_all(db_dir).unwrap();
    }

    fs::File::create(db_path).unwrap();
}

// Check for database file existence
fn db_file_exists() -> bool {
    let db_path = get_db_path();
    Path::new(&db_path).exists()
}

// Get path to the limbo database file
// https://github.com/tursodatabase/limbo
pub fn get_db_path() -> String {
    let data_dir = dirs::data_local_dir().unwrap();
    data_dir.to_str().unwrap().to_string() + "/osintbuddy/osib.db"
}