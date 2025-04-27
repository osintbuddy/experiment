use std::env;
use tauri::Wry;
use tauri::ipc::{IpcResponse, Response};
use tauri_plugin_store::StoreExt;
use serde_json::{json, Value};
mod client;
mod db;
use glob::glob;
use serde::{Deserialize, Serialize};
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
        .invoke_handler(tauri::generate_handler![client::run_transform, ls_dbs])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Deserialize, Serialize)]
struct File {
    name: String,
    mtime: u64
}
#[derive(Serialize, Deserialize)]
struct Files {
    files: Vec<File>
}

#[tauri::command]
fn ls_dbs() -> Files  {
    let mut result: Files = Files {
        files: Vec::new()
    };
    let glob_path = db::get_data_path() + "*.db";
    for file in  glob(&glob_path).expect("Failed to read glob pattern") {
        let file_str = file.unwrap().display().to_string();
        result.files.push(File {
            name: file_str.clone(),
            mtime: file_modified_time_in_seconds(file_str.as_str())
        });
    }
    return result;
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