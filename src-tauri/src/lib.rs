use tauri_plugin_store::StoreExt;

mod venv;
mod db;

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
        .invoke_handler(tauri::generate_handler![
            venv::run_transform,
            db::ls_dbs,
            db::unlock_db,
            db::delete_file,
            db::create_db
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
