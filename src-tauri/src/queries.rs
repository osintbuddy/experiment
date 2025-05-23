use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};
use tokio::sync::Mutex;

use crate::{DbState, db};

#[derive(Deserialize, Serialize, Debug, sqlx::FromRow)]
pub struct Graph {
    id: i32,
    graphid: String,
    label: String,
    description: String,
    ctime: i32,
}

#[tauri::command(async)]
pub async fn select_graphs(offset: i32, app: AppHandle) -> Result<Vec<Graph>, std::string::String> {
    let state = app.state::<Mutex<DbState>>();
    let state = state.lock().await;
    let db_result = db::get_db(&state.dbpath, &state.password).await;

    match db_result {
        Ok(db) => sqlx::query_as::<_, Graph>("SELECT * FROM graphs LIMIT 50 OFFSET $1")
            .bind(offset)
            .fetch_all(&db)
            .await
            .map_err(|err| err.to_string()),
        Err(error) => Err(error.to_string()),
    }
}

#[tauri::command(async)]
pub async fn insert_graph(
    label: String,
    description: String,
    app: AppHandle,
) -> Result<Graph, std::string::String> {
    let state = app.state::<Mutex<DbState>>();
    let state = state.lock().await;
    let db_result = db::get_db(&state.dbpath, &state.password).await;

    sqlx::query_as::<_, Graph>(
        "INSERT INTO graphs (label, description) VALUES ($1, $2) RETURNING *",
    )
    .bind(label)
    .bind(description)
    .fetch_one(&db_result.expect("error accessing db"))
    .await
    .map_err(|err| err.to_string())
}
