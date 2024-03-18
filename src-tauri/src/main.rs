// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use image::{DynamicImage, GenericImageView, Rgba};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
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
        .invoke_handler(tauri::generate_handler![greet, image_handler])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
