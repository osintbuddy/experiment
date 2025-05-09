use dirs;
use sqlx::sqlite::SqliteConnectOptions;
use sqlx::{Pool, Sqlite, SqlitePool};
use sqlx;
use std::fs;
use std::path::Path;
use std::str::FromStr;


pub async fn init() {
    let data_path = get_data_path();
    fs::create_dir_all(data_path).expect("create dir all err");
    get_db("osib", "osib").await;
}

pub fn get_data_path() -> String {
    let data_dir = dirs::data_local_dir().unwrap();
    format!("{}/osintbuddy/", &data_dir.to_str().unwrap().to_string())
}

pub async fn get_db(filepath: &str, password: &str) -> Pool<Sqlite> {
    let db_path = get_data_path() + filepath + ".db";
    let cfg = SqliteConnectOptions::from_str(&db_path)
        .expect("file err")
        .pragma("key", password.to_owned())
        .create_if_missing(true);

    let pool = SqlitePool::connect_with(cfg).await.expect("err");
    let migrator = sqlx::migrate::Migrator::new(Path::new("./src/migrations")).await.expect("error");
    migrator.run(&pool).await.expect("migrator run err");
    return pool
}


