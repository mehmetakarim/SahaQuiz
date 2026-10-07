use serde::{Deserialize, Serialize};
use std::io::{BufRead, BufReader, Write};
use std::process::{Command, Stdio};
use tauri::{AppHandle, Emitter};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DependencyStatus {
    pub python_available: bool,
    pub python_version: String,
    pub ffmpeg_available: bool,
    pub ffmpeg_version: String,
}

mod commands {
    use super::*;

    #[tauri::command]
    pub fn check_dependencies() -> DependencyStatus {
        let python_check = Command::new("python3").arg("--version").output();
        let (python_available, python_version) = match python_check {
            Ok(output) if output.status.success() => (
                true,
                String::from_utf8_lossy(&output.stdout).trim().to_string(),
            ),
            _ => (false, "Bulunamadı".to_string()),
        };

        let ffmpeg_check = Command::new("ffmpeg").arg("-version").output();
        let (ffmpeg_available, ffmpeg_version) = match ffmpeg_check {
            Ok(output) if output.status.success() => {
                let full = String::from_utf8_lossy(&output.stdout);
                let first_line = full.lines().next().unwrap_or("FFmpeg").to_string();
                (true, first_line)
            }
            _ => (false, "Bulunamadı".to_string()),
        };

        DependencyStatus {
            python_available,
            python_version,
            ffmpeg_available,
            ffmpeg_version,
        }
    }

    #[tauri::command]
    pub async fn run_sidecar_action(
        app: AppHandle,
        action: String,
        payload: serde_json::Value,
    ) -> Result<serde_json::Value, String> {
        tokio::task::spawn_blocking(move || {
            // Proje kök dizinini dinamik ve güvenilir şekilde belirle
            let current_dir = std::env::current_dir().unwrap_or_else(|_| std::path::PathBuf::from("."));
            let project_root = if current_dir.join("sidecar/main.py").exists() {
                current_dir
            } else if current_dir.join("../sidecar/main.py").exists() {
                current_dir.join("..").canonicalize().unwrap_or_else(|_| current_dir.join(".."))
            } else {
                current_dir
            };

            // Python çalıştırıcı yolunu belirle
            let venv_unix = project_root.join(".venv/bin/python3");
            let venv_win = project_root.join(".venv/Scripts/python.exe");

            let python_bin = if venv_unix.exists() {
                venv_unix.to_string_lossy().to_string()
            } else if venv_win.exists() {
                venv_win.to_string_lossy().to_string()
            } else {
                "python3".to_string()
            };

            let script_path = project_root.join("sidecar/main.py");
            if !script_path.exists() {
                return Err(format!(
                    "Sidecar scripti bulunamadı: {}. Çalışma dizini: {}",
                    script_path.display(),
                    project_root.display()
                ));
            }

            let mut cmd = Command::new(&python_bin);
            cmd.arg(&script_path)
                .current_dir(&project_root)
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped());

            let mut child = cmd
                .spawn()
                .map_err(|e| format!("Python sidecar başlatılamadı ({}, {}): {}", python_bin, project_root.display(), e))?;

            let mut req = payload.clone();
            if let Some(obj) = req.as_object_mut() {
                obj.insert("action".to_string(), serde_json::Value::String(action));
            }

            let json_line = serde_json::to_string(&req)
                .map_err(|e| format!("İstek JSON formatına dönüştürülemedi: {}", e))?;

            // Stdin'e json yaz
            if let Some(mut stdin) = child.stdin.take() {
                if let Err(e) = writeln!(stdin, "{}", json_line) {
                    // Yazılamadıysa stderr'i okuyup hatayı kullanıcıya açıklayalım
                    let mut err_msg = String::new();
                    if let Some(mut stderr) = child.stderr.take() {
                        use std::io::Read;
                        let _ = stderr.read_to_string(&mut err_msg);
                    }
                    return Err(format!(
                        "Sidecar stdin yazılamadı: {} (Python Stderr: {})",
                        e,
                        err_msg.trim()
                    ));
                }
                // flush ve drop
                let _ = stdin.flush();
            }

            let stdout = child.stdout.take().ok_or("Stdout alınamadı")?;
            let reader = BufReader::new(stdout);
            let mut final_response: Option<serde_json::Value> = None;

            for line in reader.lines() {
                match line {
                    Ok(l) => {
                        let trimmed = l.trim();
                        if trimmed.is_empty() {
                            continue;
                        }
                        if let Ok(val) = serde_json::from_str::<serde_json::Value>(trimmed) {
                            let msg_type = val.get("type").and_then(|t| t.as_str()).unwrap_or("");
                            if msg_type == "progress" {
                                let _ = app.emit("sidecar-progress", &val);
                            } else if msg_type == "meta"
                                || msg_type == "frames"
                                || msg_type == "done"
                                || msg_type == "error"
                            {
                                final_response = Some(val);
                            }
                        }
                    }
                    Err(e) => eprintln!("Stdout satır okuma hatası: {}", e),
                }
            }

            let status = child
                .wait()
                .map_err(|e| format!("Sidecar bekleme hatası: {}", e))?;

            if !status.success() && final_response.is_none() {
                let mut err_msg = String::new();
                if let Some(mut stderr) = child.stderr.take() {
                    use std::io::Read;
                    let _ = stderr.read_to_string(&mut err_msg);
                }
                return Err(format!(
                    "Sidecar başarısız çıkış yaptı (kod {:?}): {}",
                    status.code(),
                    err_msg.trim()
                ));
            }

            final_response.ok_or_else(|| "Sidecar'dan geçerli yanıt alınamadı".to_string())
        })
        .await
        .map_err(|e| format!("Tokio join error: {}", e))?
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            commands::check_dependencies,
            commands::run_sidecar_action
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
