import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';


export const addBlog = async (req, res) => {
    try {
        const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog);
        const imgeFile = req.file;
        
        //Check if all fields are provided
        if(!title || !description || !category || !imgeFile) {
            return res.json({success: false, message: "All fields are required"})
        }

        const fileBuffer = fs.readFileSync(imgeFile.path)
        let image;

        try {
            //Upload image to imagekit
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: imgeFile.originalname,
                folder: '/blogs'
            })

            // optimization through imagekit URL transformation
            const optimizedImageUrl = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: "auto",}, //auto quality
                    {format: "webp"}, //webp format
                    {width: "1280"} //width
                ]
            })

            image = optimizedImageUrl;
        } catch (imageKitError) {
            // Fallback to local file path if ImageKit fails
            image = imgeFile.path;
        }

await Blog.create({
    title,
    subTitle,
    description,
    category,
    image,
    isPublished
})

res.json({success: true, message: "Blog added successfully"})


    } catch (error) {
        res.json({success: false, message: error.message});
    }
}