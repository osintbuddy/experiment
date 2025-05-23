use dirs;
use std::fs;
use std::path::Path;
use std::str::FromStr;
use sqlx::sqlite::{SqliteConnectOptions};
use sqlx::{Pool, Sqlite, SqlitePool};
use serde::{Deserialize, Serialize};
use glob::glob;
use sqlx;

use crate::utils::file_modified_time_in_seconds;
use crate::{db, errs};

#[derive(Deserialize, Serialize)]
pub struct File {
    name: String,
    mtime: u128
}

#[derive(Deserialize, Serialize, Debug, sqlx::FromRow)]
pub struct Graph {
    id: i32,
    graphid: String,
    label: String,
    description: String,
    ctime: i32,
}

pub fn get_data_path() -> String {
    let data_dir = dirs::data_local_dir().unwrap();
    format!("{}/osintbuddy/", &data_dir.to_str().unwrap().to_string())
}

pub async fn get_db(filepath: &str, password: &str) -> Result<Pool<Sqlite>, sqlx::Error> {
    let sqlite_options = SqliteConnectOptions::from_str(&filepath)
        .unwrap()
        .pragma("key", password.to_owned())
        .create_if_missing(true);

    match SqlitePool::connect_with(sqlite_options).await {
        Ok(pool) => return Ok(pool),
        Err(error) => return Err(error),
    }
}

#[tauri::command]
pub fn ls_dbs() -> Vec<File>  {
    let mut files: Vec<File> = Vec::new();
    let glob_path = db::get_data_path() + "*.db";
    for file in glob(&glob_path).expect("Failed to read glob pattern") {
        let file_str = file.unwrap().display().to_string();
        files.push(File {
            name: file_str.clone(),
            mtime: file_modified_time_in_seconds(file_str.as_str())
        });
    }
    return files;
}


async fn handle_migration(conn: &Pool<Sqlite>) -> Result<(), std::string::String> {
    let migrator_result = sqlx::migrate::Migrator::new(Path::new("./src/migrations")).await;
    let migrator = migrator_result.unwrap_or_else(|error| {
        panic!("Problem creating the migrator: {error:?}")
    });
    migrator.run(conn).await.map_err(|err| {
        err.to_string()
    })
}

#[tauri::command]
pub async fn unlock_db(filename: String, password: String) -> Result<Vec<Graph>, String> {
    let conn = db::get_db(&filename, &password).await.expect("error unlocking db");
    handle_migration(&conn).await?;
    let query_result = sqlx::query_as::<_, Graph>("SELECT * FROM graphs").fetch_all(&conn).await;
    conn.close().await;
    query_result.map_err(|err| { err.to_string() })
}

#[tauri::command]
pub async fn create_db(filename: String, password: String) {
    let db_path = get_data_path() + &filename + ".db";
    db::get_db(&db_path, &password).await.expect("Error creating db");
}

#[tauri::command]
pub fn delete_db(filename: String) -> Result<(), errs::Error> {
    fs::remove_file(&filename)?;
    Ok(())
}
