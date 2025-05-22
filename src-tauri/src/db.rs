use dirs;
use sqlx::sqlite::SqliteConnectOptions;
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

pub fn get_data_path() -> String {
    let data_dir = dirs::data_local_dir().unwrap();
    format!("{}/osintbuddy/", &data_dir.to_str().unwrap().to_string())
}

pub async fn get_db(filepath: &str, password: &str) -> Pool<Sqlite> {
    let db_path = get_data_path() + filepath + ".db";
    let cfg = SqliteConnectOptions::from_str(&db_path)
        .expect("file err")
        .pragma("key", password.to_owned())
        .create_if_missing(true);

    let pool = SqlitePool::connect_with(cfg).await.expect("err");
    let migrator = sqlx::migrate::Migrator::new(Path::new("./src/migrations")).await.expect("error");
    migrator.run(&pool).await.expect("migrator run err");
    return pool
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
pub async fn unlock_db(filename: String, password: String) {
    let conn = db::get_db(&filename, &password).await;
    let result = sqlx::query("SELECT 1 as v").execute(&conn).await.unwrap();
    println!("Result {:?}", result);
}

#[tauri::command]
pub async fn create_db(filename: String, password: String) {
    db::get_db(&filename, &password).await;
}
