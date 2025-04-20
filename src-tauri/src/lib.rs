use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, run_transform])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn run_transform() {
  println!("I was invoked from JavaScript!");
  let output = Command::new("venv/bin/python3")
  .arg("./venv/bin/ob")
  .arg("run")
  .arg("")
  .output()
  .expect("failed to execute process");

  let data = output.stdout;
  println!("{:?}", data)
}