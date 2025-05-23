use tauri_plugin_store::StoreExt;
use tauri::State;
use tokio::sync::Mutex;

mod venv;
mod db;
mod errs;
mod utils;
mod queries;

#[derive(Default)]
struct DbState {
    dbpath: String,
    password: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs_pro::init())
        .manage(Mutex::new(DbState::default()))
        .setup(|app: &mut tauri::App| {
            let _ = app.store(".settings.json")?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            venv::run_transform,
            db::ls_dbs,
            db::unlock_db,
            db::delete_db,
            db::create_db
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
