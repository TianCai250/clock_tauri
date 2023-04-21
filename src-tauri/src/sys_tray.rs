use tauri::{SystemTray,CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, AppHandle, SystemTrayEvent, Manager};
pub struct Tray;
impl Tray {
  pub fn init() -> SystemTray {
    let quit = CustomMenuItem::new("quit".to_string(), "退出");

    let tray_menu = SystemTrayMenu::new()
    .add_item(quit);


    let tray = SystemTray::new().with_menu(tray_menu);
    tray
  }
  pub fn system_tray_event(app:&AppHandle, event: SystemTrayEvent) {
    match  event  {
        SystemTrayEvent::MenuItemClick { id, .. } => {
          match id.as_str() {
              "quit" => {
                std::process::exit(0);
              },
              _ => {}
          }
        },
        SystemTrayEvent::LeftClick { .. } => {
          let window = app.get_window("main").unwrap();
          window.show().unwrap();
          window.unminimize().unwrap();
          window.set_focus().unwrap();
        },
        _ => {},
    }
  }
}