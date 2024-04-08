// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashSet;

use image::{DynamicImage, GenericImageView, Rgba};
use serde::{Deserialize, Serialize};

const MAX_ROWS: i32 = 10;
const MAX_COLS: i32 = 16;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[derive(Deserialize, Debug, PartialEq, Eq, Hash, Clone, Copy, Serialize)]
struct Point {
    row: i32,
    col: i32,
}
#[derive(Deserialize, Debug, Serialize)]
#[allow(dead_code)]
struct Vertex {
    loc: Point,
    image: String,
    visible: bool,
    selected: bool,
}
fn is_turn(path: &Vec<Point>, current: Point) -> bool {
    if path.len() < 3 {
        return false;
    }
    let sp = path[path.len() - 2];
    let tp = path[path.len() - 3];
    if sp.row == tp.row {
        if current.row != sp.row {
            return true;
        }
    } else {
        if current.col != sp.col {
            return true;
        }
    }
    false
}
#[tauri::command]
fn find_path(matrix: Vec<Vec<Vertex>>, current: Point, end: Point) -> Vec<Point> {
    println!("Hello!");
    println!("{:?}", current);
    println!("{:?}", end);
    let mut visited: HashSet<Point> = HashSet::new();
    let mut path: Vec<Point> = Vec::new();
    if !dfs(&matrix, current, end, &mut path, &mut visited, 0) {
        return path;
    }
    println!("{:?}", path);
    path
}
fn dfs(
    matrix: &Vec<Vec<Vertex>>,
    current: Point,
    end: Point,
    path: &mut Vec<Point>,
    visited: &mut HashSet<Point>,
    turns: i32,
) -> bool {
    path.push(current);
    visited.insert(current);
    println!("Add a point into the path - {:?}", current);
    if current.col == end.col && current.row == end.row {
        return true;
    }
    let mut neighbors: Vec<Point> = Vec::new();
    let directions = [(1, 0), (-1, 0), (0, 1), (0, -1)];
    for (dx, dy) in directions {
        if current.col + dy >= 0
            && current.col + dy < MAX_COLS
            && current.row + dx >= 0
            && current.row + dx < MAX_ROWS
        {
            neighbors.push(Point {
                row: current.row + dx,
                col: current.col + dy,
            })
        }
    }
    for neighbor in neighbors {
        if !visited.contains(&neighbor)
            && !matrix[neighbor.row as usize][neighbor.col as usize].visible
        {
            let mut new_turns = turns;
            if is_turn(path, current) {
                new_turns += 1;
            }
            if new_turns > 2 {
                continue;
            }
            println!("Begin to test neighbor {:?}", neighbor);
            if dfs(matrix, neighbor, end, path, visited, new_turns) {
                return true;
            }
        }
    }
    visited.remove(&current);
    path.pop();
    println!("remove a point from path - {:?}", current);
    false
}


#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn image_handler() {
    // 加载原始图片
    let img = image::open("D:\\code\\DAExperiment\\game\\src\\assets\\fruit_element.bmp")
        .expect("Failed to open image");
    let mask = image::open("D:\\code\\DAExperiment\\game\\src\\assets\\fruit_mask.bmp")
        .expect("Failed to open image");
    // 获取原始图片的尺寸
    let (width, height) = img.dimensions();

    // 确保图片可以被等分成 10 个子图片
    assert_eq!(height % 10, 0, "Image height must be divisible by 10");

    // 每个子图片的高度
    let sub_img_height = height / 10;

    // 存储子图片的向量
    let mut sub_images: Vec<DynamicImage> = Vec::new();
    // 循环读取并存储每个子图片
    for i in 0..10 {
        // 计算当前子图片的区域
        let sub_img_area = img.view(0, (i * sub_img_height) as u32, width, sub_img_height);

        // 从掩码图片中获取对应区域
        let sub_mask_area = mask.view(0, (i * sub_img_height) as u32, width, sub_img_height);

        // 创建一个新的图片，大小与原图相同
        let mut sub_img =
            DynamicImage::new_rgba8(sub_img_area.width(), sub_img_area.height()).to_rgba8();
        // 遍历子图片的每个像素，并根据掩码图片去除白色背景
        for (x, y, pixel) in sub_mask_area.pixels() {
            let img_pixel = sub_img_area.get_pixel(x, y);
            if pixel[0] != 0 || pixel[1] != 0 || pixel[2] != 0 {
                // 如果掩码中的像素为白色，则将对应位置的像素赋值给子图片
                sub_img.put_pixel(x, y, img_pixel.clone());
            } else {
                sub_img.put_pixel(x, y, Rgba([0, 0, 0, 0]))
            }
        }
        // 存储子图片到向量中
        sub_images.push(image::DynamicImage::ImageRgba8(sub_img));
    }
    for (index, image) in sub_images.iter().enumerate() {
        let file_name = format!("image_{}.png", index);
        image.save(file_name).expect("Failed to save image");
    }
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, image_handler, find_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
