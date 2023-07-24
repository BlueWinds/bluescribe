use serde_json::{json, Map, Value};
use std::borrow::BorrowMut;
use std::collections::HashMap;
use std::fs;
use std::io::{BufWriter, Write};
use std::path::{Path, PathBuf};
use xml2json_rs::JsonConfig;

// This implementation is compatible with v4 of the JavaScript implementation
const CACHE_VERSION: u8 = 5;

fn load_cache(dir: &Path) -> Result<String, String> {
    println!("Loading cache");
    let cache_file = dir.join("cache.json");
    if cache_file.exists() {
        let cache_str = fs::read_to_string(cache_file).unwrap_or_default();
        let cache: Value = serde_json::from_str(&cache_str).unwrap_or(json!({}));
        if let Some(version) = cache.as_object().unwrap().get("version") {
            if version == CACHE_VERSION {
                return Ok(cache_str);
            } else {
                println!(
                    "Cache version mismatch. Found v{}, wanted v{}",
                    version, CACHE_VERSION
                );
            }
        } else {
            println!("No version found in cache file");
        }
    }
    Err("No cache found".to_string())
}

fn read_xml(path: &Path) -> Result<Value, String> {
    let xml_data = fs::read_to_string(path);
    if xml_data.is_err() {
        return Err("Unable to read file".to_string());
    }

    let xml_data = xml_data.unwrap();
    let json_builder = JsonConfig::new()
        .merge_attrs(true)
        .charkey("#text")
        .finalize();
    let json = json_builder.build_from_xml(&xml_data);

    if json.is_err() {
        return Err("Unable to parse XML".to_string());
    }

    Ok(json.unwrap())
}

fn remove_shared(obj: &mut Map<String, Value>) {
    let keys_to_remove = obj
        .iter()
        .filter_map(|(key, _)| {
            if key.starts_with("shared") {
                Some(key.clone())
            } else {
                None
            }
        })
        .collect::<Vec<String>>();
    keys_to_remove.iter().for_each(|key| {
        obj.remove(key);
    });
}

fn index(x: &mut Value) -> HashMap<String, Value> {
    let mut data_ids = HashMap::new();

    if let Some(object) = x.as_object_mut() {
        object.iter_mut().for_each(|(_, value)| {
            data_ids.extend(index(value));
        });
        remove_shared(object);

        // If this is an object with only one attribute, collapse it
        // If the child is an object, add a type attribute
        if object.len() == 1 {
            if let Some((key, value)) = object.iter_mut().next() {
                if value.is_object() {
                    value["type"] = json!(key);
                }
                *x = value.take();
            }
        }
    } else if let Some(array) = x.as_array_mut() {
        array.iter_mut().for_each(|value| {
            data_ids.extend(index(value.borrow_mut()));
        });

        // If this is a 1 length array containing an object, collapse it
        if array.len() == 1 && !array[0].is_object() {
            *x = array[0].take();
        }
    } else if let Some(string) = x.as_str() {
        // bools and numbers end up as strings. Fix up their types or trim whitespace
        if string == "true" {
            *x = json!(true);
        } else if string == "false" {
            *x = json!(false);
        } else if let Ok(number) = string.parse::<f64>() {
            *x = json!(number);
        } else {
            *x = json!(string);
        }
    }

    if x.is_object() {
        if let Some(Value::String(data_id)) = x.get("id") {
            data_ids.insert(data_id.clone(), x.clone());
        }
    }

    data_ids
}

#[tauri::command]
pub async fn fast_cache(dir: String, game_system_path: String) -> Result<String, String> {
    println!("Reading files from {}", dir);
    println!("Writing cache to {}", game_system_path);

    let dir: &Path = Path::new(&dir);
    let game_system_path = Path::new(&game_system_path);

    if let Ok(cache) = load_cache(game_system_path) {
        println!("Valid Cache");
        return Ok(cache);
    }

    println!("No cache found. Reparsing raw files.");

    let mut parsed = json!( {
        "version": CACHE_VERSION,
        "catalogues": {},
    });

    let paths = fs::read_dir(dir).expect("Unable to read directory");
    let count = fs::read_dir(dir).expect("Unable to read directory").count();
    for (i, path) in paths.enumerate() {
        println!("Parsing file {} of {}", i + 1, count);
        let path = path.expect("Unable to read path").path();
        // If the path is a json file, don't even try
        let extension = path.extension();
        if let Some(extension) = extension {
            if extension != "cat" && extension != "gst" {
                continue;
            }
        } else {
            // No extension
            continue;
        }
        let mut data = read_xml(&path)?;
        if data.is_null() {
            println!("Unable to parse file {:?} (null)", path);
            continue;
        }

        let data_ids = index(&mut data);
        if !data.is_object() {
            continue;
        }
        data.as_object_mut()
            .unwrap()
            .insert("ids".to_string(), json!(data_ids));

        if data["type"] == "gameSystem" {
            parsed["gameSystem"] = data;
        } else if data["type"] == "catalogue" {
            let data_id = data["id"].as_str().unwrap().to_string();
            parsed["catalogues"][data_id] = data;
        } else {
            return Err("Wut?".to_string());
        }
    }

    let mut cache_path = PathBuf::new();
    cache_path.push(game_system_path);
    fs::create_dir_all(&cache_path).unwrap();
    cache_path.push("cache.json");
    let mut file = BufWriter::new(fs::File::create(&cache_path).unwrap());
    let data = serde_json::to_string(&parsed).unwrap();
    file.write_all(data.as_bytes()).unwrap();

    Ok(data)
}
