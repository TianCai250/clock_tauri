// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::api::notification::Notification;

mod sys_tray;



fn main() {
    tauri::Builder::default()
        // 单例运行
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            Notification::new(&app.config().tauri.bundle.identifier)
                .title("程序已经在运行 请勿重复启动！")
                .body(cwd)
                .icon("pot")
                .show()
                .unwrap();
        }))
        .system_tray(sys_tray::Tray::init())
        //绑定托盘事件
        .on_system_tray_event(|app, event| {
            sys_tray::Tray::system_tray_event(app, event);
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
