> [!WARNING]  
> This is nothing more than code exploration for the time being and I haven't fully committed to a Rust rewrite, I'm also still in the process of learning Rust...

# Experimenting with a Tauri + Preact + Typescript version of OSINTBuddy

- [ ] Investigate how running plugins from Rust could work
  - [x] venv approach: https://doc.rust-lang.org/std/process/struct.Command.html *(works)*
  - [ ] embedded approach: https://github.com/PyO3/pyo3 *(unknown)*


## Development

1. Download the dependencies and run the development version of the app 
   ```
   pnpm i
   pnpm tauri dev
   ```

## Build

1. Build the app
   ```
   pnpm tauri build
   ```


## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
