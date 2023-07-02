use read_files::fast_cache;

pub mod read_files;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![fast_cache])
        .run(tauri::generate_context!())
        .expect("error while running bluescribe");
}
