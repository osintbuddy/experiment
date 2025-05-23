use serde::{Deserialize, Serialize};
use sqlx::{Pool, Sqlite};


#[derive(Deserialize, Serialize, Debug, sqlx::FromRow)]
pub struct Graph {
    id: i32,
    graphid: String,
    label: String,
    description: String,
    ctime: i32,
}

pub async fn get_graphs(conn: Pool<Sqlite>) -> Result<Vec<Graph>, std::string::String> {
  let query_result = sqlx::query_as::<_, Graph>("SELECT * FROM graphs").fetch_all(&conn).await;
  query_result.map_err(|err| { err.to_string() })
}