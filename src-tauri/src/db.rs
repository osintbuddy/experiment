use dirs;
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
use sqlx::ConnectOptions;
use std::fmt::format;
use std::str::FromStr;
use glob::glob;

pub fn init() {
}

pub fn get_data_path() -> String {
    let data_dir = dirs::data_local_dir().unwrap();
    format!("{}/osintbuddy/", &data_dir.to_str().unwrap().to_string())
}

pub async fn create_encrypted_database(filename: &str, password: &str) -> anyhow::Result<()> {
    let db_path = get_data_path() + filename + ".db";
    let _ = SqliteConnectOptions::from_str(&db_path)?
        .pragma("key", password.to_owned())
        .create_if_missing(true)
        .connect()
        .await?;

    Ok(())
}




