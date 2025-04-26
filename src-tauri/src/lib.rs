use std::env;
use tauri::Wry;
use tauri_plugin_store::StoreExt;
use serde_json::json;
mod client;
mod db;
use glob::glob;
use serde::Deserialize;
use std::fs;
use std::time::UNIX_EPOCH;
// use sqlx::sqlite::SqliteQueryResult;
// use sqlx::{query, Connection, SqliteConnection};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|_app| {
            _app.store(".settings.json")?;
            db::init();
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs_pro::init())
        .invoke_handler(tauri::generate_handler![client::run_transform, list_encrypted_databases])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "PascalCase")]
struct File {
    name: String,
    mtime: String
}

#[tauri::command]
fn list_encrypted_databases()  {
    let db_path = db::get_data_path();
    println!("{}", db_path);
    let glob_path = db_path + "*.db";
    for file in  glob(&glob_path ).expect("Failed to read glob pattern") {
        println!("{}", file.unwrap().display());
    }
}

fn file_modified_time_in_seconds(path: &str) -> u64 {
    fs::metadata(path)
    .unwrap()
    .modified()
    .unwrap()
    .duration_since(UNIX_EPOCH)
    .unwrap()
    .as_secs()
}