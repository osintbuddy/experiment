use dirs;
use sqlx::sqlite::{SqliteConnectOptions};
use sqlx::{Pool, Sqlite, SqlitePool};
use std::fs;
use std::path::Path;
use std::str::FromStr;
use serde::{Deserialize, Serialize};
use std::time::UNIX_EPOCH;
use glob::glob;
use sqlx;

use crate::db;

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
        Ok(p) => return Ok(p),
        Err(error) => {
            println!("error getting db pool: {}", error);
            return Err(error);
        },
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

fn file_modified_time_in_seconds(path: &str) -> u128 {
    fs::metadata(path)
    .unwrap()
    .modified()
    .unwrap()
    .duration_since(UNIX_EPOCH)
    .unwrap()
    .as_millis()
}

#[tauri::command]
pub async fn unlock_db(filename: String, password: String) -> Vec<Graph> {
    let conn = db::get_db(&filename, &password).await;

    match &conn {
        Ok(conn) => {
            let migrator = sqlx::migrate::Migrator::new(Path::new("./src/migrations")).await.expect("error");
            migrator.run(conn).await.expect("Error running migrator");
            let rows: Vec<Graph> = sqlx::query_as::<_, Graph>("SELECT * FROM graphs").fetch_all(conn).await.unwrap();
            conn.close().await;
            return rows;
        },
        Err(error) => {
            println!("unlock_db failed to get conn {}", error);
            return Vec::new();
        },
    };
}

#[tauri::command]
pub async fn create_db(filename: String, password: String) {
    let db_path = get_data_path() + &filename + ".db";
    db::get_db(&db_path, &password).await.expect("Error creating db");
}

#[tauri::command]
pub fn delete_file(filename: String) {
    match fs::remove_file(&filename) {
        Ok(()) => (),
        Err(error) => println!("File deletion error: {}", error)
    };
}
