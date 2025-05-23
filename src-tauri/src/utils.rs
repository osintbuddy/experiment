use std::fs;
use std::time::UNIX_EPOCH;

pub fn file_modified_time_in_seconds(path: &str) -> u128 {
  fs::metadata(path)
  .unwrap()
  .modified()
  .unwrap()
  .duration_since(UNIX_EPOCH)
  .unwrap()
  .as_millis()
}