use tauri::{AppHandle};
use tauri_plugin_store::{ StoreExt};
use std::{ process::Command};

#[tauri::command]
pub fn run_transform(app: AppHandle, source: String) -> serde_json::Value {
    let store = app.get_store(".settings.json").expect("Error accessing settings store");
    let venv_path = store.get("venv_path").unwrap();
    let plugins_path = store.get("plugins_path").unwrap();

    let venv_path: String = serde_json::from_value(venv_path).expect("error parsing store venv value");
    let plugins_path: String = serde_json::from_value(plugins_path).expect("error parsing store plugins value");
    
    let venv_py = format!("{venv_path}/bin/python3");
    let venv_ob = format!("{venv_path}/bin/ob");
    
    let output = Command::new(venv_py)
        .env("PYTHONHOME", "")
        .env("PYTHONPATH", &venv_ob)
        .arg(venv_ob)
        .arg("run")
        .arg("--plugins")
        .arg(plugins_path)
        .arg("--transform")
        .arg(source)
        .output()
        .expect("failed to execute process");

    let transform_result= String::from_utf8_lossy(&output.stdout).to_string();
    let transform_json: serde_json::Value = serde_json::from_str(&transform_result).expect("Error parsing transfrom result json");

    println!("status: {}", output.status);
    println!("out: {}", transform_json);
    println!("stderr: {}", String::from_utf8_lossy(&output.stderr));
    assert!(output.status.success());
    return transform_json
}
