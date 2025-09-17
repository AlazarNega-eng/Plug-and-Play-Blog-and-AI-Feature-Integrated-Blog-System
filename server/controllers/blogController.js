import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';
import main from '../configs/gemini.js';



export const addBlog = async (req, res) => {
    try {
        const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog);
        const imgeFile = req.file;
        
        //Check if all required fields are provided
        if(!title || !description || !category) {
            return res.json({success: false, message: "Title, description, and category are required"})
        }

        let image = null;

        // Handle image upload if provided
        if(imgeFile) {
            try {
                const fileBuffer = fs.readFileSync(imgeFile.path);
                
                if(imagekit) {
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
                } else {
                    // Fallback to local file path if ImageKit is not available
                    image = imgeFile.path;
                }
            } catch (imageKitError) {
                console.log("ImageKit upload failed:", imageKitError.message);
                // Fallback to local file path if ImageKit fails
                image = imgeFile.path;
            }
        } else {
            // No image provided, use a default placeholder
            image = "https://via.placeholder.com/1280x720/cccccc/969696?text=No+Image";
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
        console.log("Blog creation error:", error.message);
        res.json({success: false, message: error.message});
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({isPublished: true});
        res.json({success: true, blogs});
    } catch (error) {
        console.log("Get all blogs error:", error.message);
        res.json({success: false, message: error.message});
    }
}

export const getBlogById = async (req, res) => {
    try {
        // Support fetching id from URL params, query, or body for compatibility
        const blogId = req.params.blogId || req.query.blogId || req.body.blogId || req.params.id || req.body.id;
        if (!blogId) {
            return res.json({ success: false, message: "Blog id is required" });
        }
        const blog = await Blog.findById(blogId);
        if(!blog) {
            return res.json({success: false, message: "Blog not found"});
        }
        res.json({success: true, blog});
    } catch (error) {
        console.log("Get blog by id error:", error.message);
        res.json({success: false, message: error.message});
    }
}

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);

        //Delete all comments related to the blog
        await Comment.deleteMany({blog: id});
        res.json({success: true, message: "Blog deleted successfully"});
    } catch (error) {
        console.log("Delete blog error:", error.message);
        res.json({success: false, message: error.message});
    }
}


export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({success: true, message: "Blog published status updated successfully"});
    } catch (error) {
        console.log("Toggle publish error:", error.message);
        res.json({success: false, message: error.message});
    }
}

export const addComment = async (req, res) => {
    try {
        const {blog, name, content} = req.body;
        await Comment.create({blog, name, content});
        res.json({success: true, message: "Comment added successfully and waiting for approval"});
    } catch (error) {
        console.log("Add comment error:", error.message);
        res.json({success: false, message: error.message});
    }
}

export const getComments = async (req, res) => {
    try {
        // Accept blog id from URL params or body with multiple key variants
        const blogId = req.params.blogId || req.body.blogId || req.body.blogID || req.query.blogId;
        if (!blogId) {
            return res.json({ success: false, message: "Blog id is required" });
        }
        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});
        res.json({success: true, comments});
    } catch (error) {
        console.log("Get comments error:", error.message);
        res.json({success: false, message: error.message});
    }
}

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const desiredLength = req.body.length || 1000; // approximate words
        const language = req.body.language || 'English';
        const outlinePoints = Array.isArray(req.body.outline) ? req.body.outline : [];
        const keywords = Array.isArray(req.body.keywords) ? req.body.keywords : [];

        if (!prompt || typeof prompt !== 'string') {
            return res.json({ success: false, message: 'Prompt (title/topic) is required' });
        }

        const outlineSection = outlinePoints.length
            ? `\nFollow this outline where appropriate (expand each point into 1-3 paragraphs):\n- ${outlinePoints.join('\n- ')}`
            : '';

        const keywordsSection = keywords.length
            ? `\nNaturally incorporate these keywords: ${keywords.join(', ')}`
            : '';

        const fullPrompt = `You are a senior content writer. Write a comprehensive, well-structured blog post in ${language} about: "${prompt}".\n
Target length: approximately ${desiredLength} words.\n
Requirements:\n- Start with a compelling introduction (2-3 paragraphs).\n- Use clear H2/H3 subheadings.\n- Include at least one bulleted or numbered list where it fits.\n- Provide practical examples or tips.\n- Include a short conclusion with a call-to-action.\n- Add 3 concise FAQs at the end with short answers.\n- Use simple language that is accessible to general readers.\n- Avoid fluff; maintain helpful, factual tone.\n- Output in Markdown only (no frontmatter).${outlineSection}${keywordsSection}`;

        const content = await main(fullPrompt);
        res.json({ success: true, content });
    } catch (error) {
        console.log("Generate content error:", error.message);
        res.json({success: false, message: error.message});
    }
}