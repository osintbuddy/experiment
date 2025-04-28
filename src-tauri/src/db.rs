use anyhow::Ok;
use dirs;
use sqlx::sqlite::SqliteConnectOptions;
use sqlx::ConnectOptions;
use std::fs;
use std::str::FromStr;

pub fn init() {
    let data_path = get_data_path();
    fs::create_dir_all(data_path).expect("create dir all err");
    create_encrypted_database("osib", "osib").expect("err db on init")
}

pub fn get_data_path() -> String {
    let data_dir = dirs::data_local_dir().unwrap();
    format!("{}/osintbuddy/", &data_dir.to_str().unwrap().to_string())
}

pub fn create_encrypted_database(filename: &str, password: &str) -> anyhow::Result<()> {
    let db_path = get_data_path() + filename + ".db";
    let _ = SqliteConnectOptions::from_str(&db_path)?
        .pragma("key", password.to_owned())
        .create_if_missing(true)
        .connect();

    Ok(())
}




