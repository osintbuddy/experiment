use dirs;
use sqlx::migrate::MigrateError;
use tauri::{AppHandle, Manager};
use tokio::sync::Mutex;
use std::fs;
use std::path::Path;
use std::str::FromStr;
use sqlx::sqlite::{SqliteConnectOptions};
use sqlx::{Pool, Sqlite, SqlitePool};
use serde::{Deserialize, Serialize};
use glob::glob;
use sqlx;

use crate::utils::file_modified_time_in_seconds;
use crate::{db, errs, DbState};

#[derive(Deserialize, Serialize)]
pub struct File {
    filepath: String,
    mtime: u128
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

#[tauri::command(async)]
pub fn list_dbs() -> Vec<File>  {
    let mut files: Vec<File> = Vec::new();
    let glob_path = db::get_data_path() + "*.db";
    for file in glob(&glob_path).expect("Failed to read glob pattern") {
        let file_str = file.unwrap().display().to_string();
        files.push(File {
            filepath: file_str.clone(),
            mtime: file_modified_time_in_seconds(file_str.as_str())
        });
    }
    return files;
}

async fn handle_migration(conn: &Pool<Sqlite>) -> Result<(), MigrateError> {
    let migrator_result = sqlx::migrate::Migrator::new(Path::new("./src/migrations")).await;
    let migrator = migrator_result.unwrap_or_else(|error| {
        panic!("Problem creating the migrator: {error:?}")
    });
    migrator.run(conn).await
}

#[tauri::command(async)]
pub async fn unlock_db(filepath: String, password: String, app: AppHandle) -> Result<(), std::string::String> {
    let state = app.state::<Mutex<DbState>>();
    let mut state = state.lock().await;
    state.dbpath = filepath;
    state.password = password;
    let migrate_result: Result<_, std::string::String> = match db::get_db(&state.dbpath, &state.password).await {
        Ok(conn) => {
            Ok(handle_migration(&conn).await)
        },
        Err(error) => Err(error.to_string()) 
    };
    return migrate_result.expect("migration error").map_err(|err| {
        match err {
            MigrateError::Execute(_) => "Incorrect password. Please try again".to_string(),
            error => error.to_string(),
        }
    })
}

#[tauri::command(async)]
pub async fn create_db(filename: String, password: String) -> Result<(), std::string::String>{
    let db_path = get_data_path() + &filename + ".db";
    match db::get_db(&db_path, &password).await {
        Ok(_) => Ok(()),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command]
pub fn delete_db(filename: String) -> Result<(), errs::Error> {
    fs::remove_file(&filename)?;
    Ok(())
}
