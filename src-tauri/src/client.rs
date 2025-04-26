use std::process::Command;

fn get_executable_file_path() -> String {
    // FIXME: allow user to set their paths (venv & plugins paths)
    let cwd = std::env::current_exe();
    return cwd
        .expect("not str")
        .into_os_string()
        .into_string()
        .unwrap();
}

#[tauri::command]
pub fn run_transform(source: &str) {
    let exe_path = get_executable_file_path();

    println!("p: {}", exe_path);
    println!("Transform was invoked from JavaScript!");
    println!("Running with: {source}");

    let plugins_path = format!("{exe_path}plugins");
    let venv_py = format!("{exe_path}venv/bin/python3");
    let venv_ob = format!("{exe_path}venv/bin/ob");

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

    println!("status: {}", output.status);
    println!("out: {}", String::from_utf8_lossy(&output.stdout));
    println!("stderr: {}", String::from_utf8_lossy(&output.stderr));
    assert!(output.status.success());
}
