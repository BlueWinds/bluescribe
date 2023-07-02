use serde_json::{json, Map, Value};
use std::borrow::BorrowMut;
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use xml2json_rs::JsonConfig;

// This implementation is compatible with v4 of the JavaScript implementation
const CACHE_VERSION: u8 = 4;
static READING_FILES: AtomicBool = AtomicBool::new(false);

#[allow(dead_code)]
fn load_cache(dir: &Path) -> Result<Value, String> {
    println!("Loading cache");
    let cache_file = dir.join("cache.json");
    if cache_file.exists() {
        let cache_str = fs::read_to_string(cache_file).expect("Unable to read cache file");
        let cache: Value = serde_json::from_str(&cache_str).expect("Unable to parse cache file");
        if let Some(version) = cache.as_object().unwrap().get("version") {
            if version == CACHE_VERSION {
                return Ok(cache);
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
    let xml_data = fs::read_to_string(path).expect("Unable to read XML file");
    let json_builder = JsonConfig::new().merge_attrs(true).finalize();
    let json = json_builder
        .build_from_xml(&xml_data)
        .expect("Failed to parse XML");

    Ok(json)
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
    }

    if x.is_object() {
        if let Some(Value::String(data_id)) = x.get("id") {
            data_ids.insert(data_id.clone(), x.clone());
        }
    }

    data_ids
}

#[tauri::command]
pub async fn fast_cache(dir: String) {
    // Only read files one at a time
    if READING_FILES
        .compare_exchange(false, true, Ordering::SeqCst, Ordering::SeqCst)
        .is_err()
    {
        return;
    }

    println!("Reading files from {}", dir);
    let dir = Path::new(&dir);

    // if let Ok(_) = load_cache(dir) {
    //     println!("Valid Cache");
    //     return;
    // }

    // println!("No cache found. Reparsing raw files.");

    let mut parsed = json!( {
        "version": CACHE_VERSION,
        "catalogues": {},
    });

    let paths = fs::read_dir(dir).expect("Unable to read directory");
    let count = fs::read_dir(dir).expect("Unable to read directory").count();
    for (i, path) in paths.enumerate() {
        println!("Parsing file {} of {}", i, count);
        let path = path.expect("Unable to read path").path();
        let mut data = read_xml(&path).expect(format!("Unable to parse XML ({:?})", path).as_str());
        if data.is_null() {
            println!("Unable to parse file {:?} (null)", path);
            continue;
        }

        let data_ids = index(&mut data);
        if !data.is_object() {
            println!("Data is not an object!!!!");
            println!("{:?}", data);
        }
        data.as_object_mut()
            .unwrap()
            .insert("ids".to_string(), json!(data_ids));

        // let mut dump_path = PathBuf::new();
        // dump_path.push("..\\dump");
        // fs::create_dir_all(&dump_path).unwrap();
        // dump_path.push(format!(
        //     "{}.json",
        //     path.file_name().unwrap().to_str().unwrap()
        // ));
        // let mut file = fs::File::create(&dump_path).unwrap();
        // serde_json::to_writer_pretty(&mut file, &data).unwrap();

        if data["type"] == "gameSystem" {
            parsed["gameSystem"] = data;
        } else if data["type"] == "catalogue" {
            let data_id = data["id"].as_str().unwrap().to_string();
            parsed["catalogues"][data_id] = data;
        } else {
            READING_FILES.store(false, Ordering::SeqCst);
            return;
        }
    }

    let mut cache_path = PathBuf::new();
    cache_path.push(dir);
    fs::create_dir_all(&cache_path).unwrap();
    cache_path.push("cache.json");
    println!("Writing to {:?}", cache_path);
    let mut file = fs::File::create(&cache_path).unwrap();
    serde_json::to_writer_pretty(&mut file, &parsed).unwrap();
    println!("\tWritten.");

    READING_FILES.store(false, Ordering::SeqCst);
}
