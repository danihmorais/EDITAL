use serde_json::{json, Value};
use std::fs;
use std::path::PathBuf;
use std::process::Stdio;
use tokio::io::AsyncWriteExt;
use tokio::process::Command;
use tauri::{AppHandle, Manager};
use tauri_plugin_opener::OpenerExt;

fn get_base_dir() -> Result<PathBuf, String> {
    std::env::current_exe()
        .map_err(|e| e.to_string())?
        .parent()
        .ok_or("Não foi possível localizar o diretório do executável".to_string())
        .map(|p| p.to_path_buf())
}

fn extrair_recursos() -> Result<PathBuf, String> {
    let base_dir = get_base_dir()?;

    let python_path = base_dir.join("python_backend.exe");
    let python_exe = include_bytes!("../bin/python_backend.exe");
    let _ = fs::write(&python_path, python_exe);

    let modelos_dir = base_dir.join("modelos");
    let _ = fs::create_dir_all(&modelos_dir);

    let dispensa_de = include_bytes!("../../modelos/Dispensa xx Proc xx -  MINUTA DE 15.04.2026.docx");
    let dispensa_dp = include_bytes!("../../modelos/Dispensa xx Proc xx -  MINUTA DP 15.04.2026.docx");
    let pregao_pe = include_bytes!("../../modelos/Pregão xx Proc xx -  MINUTA PE 15.04.2026.docx");
    let pregao_pp = include_bytes!("../../modelos/Pregão xx Proc xx -  MINUTA PP 15.04.2026.docx");

    let _ = fs::write(modelos_dir.join("Dispensa xx Proc xx -  MINUTA DE 15.04.2026.docx"), dispensa_de);
    let _ = fs::write(modelos_dir.join("Dispensa xx Proc xx -  MINUTA DP 15.04.2026.docx"), dispensa_dp);
    let _ = fs::write(modelos_dir.join("Pregão xx Proc xx -  MINUTA PE 15.04.2026.docx"), pregao_pe);
    let _ = fs::write(modelos_dir.join("Pregão xx Proc xx -  MINUTA PP 15.04.2026.docx"), pregao_pp);

    Ok(base_dir)
}

#[tauri::command]
async fn gerar_documentos(_app: AppHandle, dados_usuario: Value, arquivos_base: Vec<String>) -> Result<String, String> {
    let base_dir = extrair_recursos()?;
    let backend_path = base_dir.join("python_backend.exe");

    let tipo_edital = arquivos_base.first().cloned().unwrap_or_else(|| "pregao_eletronico".to_string());

    let mut child = Command::new(backend_path)
        .current_dir(&base_dir)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Falha ao iniciar o backend integrado: {}", e))?;

    if let Some(mut stdin) = child.stdin.take() {
        let payload = json!({
            "tipo_edital": tipo_edital,
            "dados_preenchimento": dados_usuario
        });

        stdin.write_all(payload.to_string().as_bytes()).await.map_err(|e| e.to_string())?;
    }

    let output = child.wait_with_output().await.map_err(|e| e.to_string())?;
    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).into_owned());
    }

    Ok(String::from_utf8_lossy(&output.stdout).into_owned())
}

#[tauri::command]
fn salvar_dados_usuario(app: AppHandle, dados: Value) -> Result<(), String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    let settings_path = app_dir.join("settings.json");

    let mut settings = if let Ok(content) = fs::read_to_string(&settings_path) {
        serde_json::from_str::<Value>(&content).unwrap_or(json!({}))
    } else {
        json!({})
    };

    settings["dados_usuario"] = dados;

    fs::write(settings_path, serde_json::to_string_pretty(&settings).unwrap_or_default())
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn ler_dados_usuario(app: AppHandle) -> Result<Value, String> {
    let app_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let settings_path = app_dir.join("settings.json");

    if let Ok(content) = fs::read_to_string(settings_path) {
        if let Ok(settings) = serde_json::from_str::<Value>(&content) {
            if let Some(dados) = settings.get("dados_usuario") {
                return Ok(dados.clone());
            }
        }
    }

    Ok(json!({}))
}

#[tauri::command]
fn abrir_link(app: AppHandle, url: String) -> Result<(), String> {
    app.opener().open_url(url, None::<&str>).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn aplicar_atualizacao(url: String) -> Result<(), String> {
    let temp_dir = std::env::temp_dir();
    let exe_path = temp_dir.join("licita_ai_update.exe");
    let client = reqwest::Client::new();
    
    let response = client.get(&url)
        .header("User-Agent", "licita-ai-updater")
        .send()
        .await
        .map_err(|e| e.to_string())?;
    
    if !response.status().is_success() {
        return Err(format!("Falha ao baixar o executável: Status {}", response.status()));
    }

    let bytes = response.bytes().await.map_err(|e| e.to_string())?;
    let mut file = std::fs::File::create(&exe_path).map_err(|e| e.to_string())?;
    std::io::Write::write_all(&mut file, &bytes).map_err(|e| e.to_string())?;

    std::process::Command::new(exe_path).spawn().map_err(|e| e.to_string())?;
    std::process::exit(0);
}

#[tauri::command]
fn abrir_pasta_documentos() -> Result<(), String> {
    let base_dir = get_base_dir()?;
    let pasta = base_dir.join("editais_gerados");

    if !pasta.exists() {
        return Err(format!(
            "Pasta não encontrada: {}",
            pasta.display()
        ));
    }

    #[cfg(target_os = "windows")]
    std::process::Command::new("explorer")
        .arg(&pasta)
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            gerar_documentos,
            salvar_dados_usuario,
            ler_dados_usuario,
            abrir_link,
            aplicar_atualizacao,
            abrir_pasta_documentos,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}