import multer from "multer";
import dotenv from 'dotenv';
import fs from 'fs';
import path from "path";
import { request } from "http";
import { fileURLToPath } from "url";
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'static/image')
    },
    filename: (req, file, cb) => {
        cb(null, path.basename(file.originalname.replace(/ /g, ""),
            path.extname(file.originalname)) + "_" + Date.now() + path.extname(file.originalname))
    }
})

export const imageUpload = multer({
    storage: imageStorage
})
export const singleImagePath = (request, response, next) => {
    const image = request.file
    console.log(image);
    if (image) {
        request.singleImagePath = `${process.env.PROTOCAL}://${request.get('host')}/image/${image.filename}`
    }
    next()
}

export const removeFilefromSystem = (filename) => {
    console.log(filename);
    
    const currentFilePath = fileURLToPath(import.meta.url);
    const projectRoot = path.resolve(path.dirname(currentFilePath), '../../');
    // Go up two levels to reach project root
    const imagePath = path.join(projectRoot, 'static', 'image', filename);
    if (fs.existsSync(imagePath)) {
        // Attempt to delete the file
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error(`Failed to delete image file ${filename}: ${err}`);
            } else {
                console.log(`Image file ${filename} deleted successfully`);
            }
        });
    } else {
        console.log(`Image file ${filename} does not exist`);
    }
}

export const removeFile = (request, filepath) => {
    console.log(filepath, "remove func");
    const filename = filepath.slice(`${process.env.PROTOCAL}://${request.get('host')}/image/`.length,)
    console.log(filename);
    removeFilefromSystem(filename);
}

