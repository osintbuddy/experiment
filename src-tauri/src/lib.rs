use std::env;
mod client;
mod db;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
  .setup(|_app| {
    db::init();
    Ok(())
  })
  .plugin(tauri_plugin_opener::init())
  .plugin(tauri_plugin_fs_pro::init())
  .plugin(tauri_plugin_store::Builder::default().build())
  .invoke_handler(tauri::generate_handler![client::run_transform])
  .run(tauri::generate_context!())
  .expect("error while running tauri application");
}
