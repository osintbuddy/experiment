use std::env;
use std::fs;
use std::time::UNIX_EPOCH;
use glob::glob;
use tauri_plugin_store::StoreExt;
use serde::{Deserialize, Serialize};
use sqlx;

mod venv;
mod db;


#[derive(Default)]
struct AppState {
  filepath: String,
  password: String,
  pyvenv: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|_app| {
            let _store = _app.store(".settings.json")?;
            // https://github.com/tauri-apps/tauri/discussions/7596
            // db::init();
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs_pro::init())
        .invoke_handler(tauri::generate_handler![venv::run_transform, ls_dbs, unlock_db, create_db])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Deserialize, Serialize)]
struct File {
    name: String,
    mtime: u128
}

#[tauri::command]
fn ls_dbs() -> Vec<File>  {
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
async fn unlock_db(filename: String, password: String) {
    let conn = db::get_db(&filename, &password).await;
    let result = sqlx::query("SELECT 1 as v").execute(&conn).await.unwrap();
    println!("Result {:?}", result);
}

#[tauri::command]
async fn create_db(filename: String, password: String) {
    db::get_db(&filename, &password).await;
}
