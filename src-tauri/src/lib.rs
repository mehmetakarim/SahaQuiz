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
            let python_bin = if std::path::Path::new(".venv/bin/python3").exists() {
                ".venv/bin/python3"
            } else if std::path::Path::new(".venv/Scripts/python.exe").exists() {
                ".venv/Scripts/python.exe"
            } else {
                "python3"
            };

            let mut child = Command::new(python_bin)
                .arg("sidecar/main.py")
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .spawn()
                .map_err(|e| format!("Python sidecar başlatılamadı: {}", e))?;

            let mut req = payload.clone();
            if let Some(obj) = req.as_object_mut() {
                obj.insert("action".to_string(), serde_json::Value::String(action));
            }

            let json_line = serde_json::to_string(&req)
                .map_err(|e| format!("İstek JSON formatına dönüştürülemedi: {}", e))?;

            if let Some(mut stdin) = child.stdin.take() {
                writeln!(stdin, "{}", json_line)
                    .map_err(|e| format!("Sidecar stdin yazılamadı: {}", e))?;
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
                return Err("Sidecar başarısız çıkış yaptı".to_string());
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
