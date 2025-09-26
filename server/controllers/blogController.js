import fs from 'fs';
import imagekit from '../configs/imageKit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';
import main from '../configs/gemini.js';

// Free thumbnail generation using placeholder services
const generateFreeThumbnail = (title, category) => {
    // Use different single background colors based on category (hex without #)
    const categoryColors = {
        'Technology': '4f46e5',
        'Business': '059669',
        'Lifestyle': 'dc2626',
        'Health': '16a34a',
        'Travel': '0284c7',
        'Food': 'ea580c',
        'Sports': '059669',
        'Education': '7c2d12',
        'Startup': '1e40af',
        'Finance': '10b981'
    };

    const bg = categoryColors[category] || '4f46e5';

    // Use placehold.co with custom text and colors (reliable and fast)
    // Format: https://placehold.co/<WIDTH>x<HEIGHT>/<BG>/<FG>?text=<TEXT>
    const placeholderUrl = `https://placehold.co/1792x1024/${bg}/ffffff?text=${encodeURIComponent(title)}`;

    return placeholderUrl;
};



export const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imgeFile = req.file;
        const aiGeneratedImage = req.body.aiGeneratedImage;
        
        // Check if blog exists
        const existingBlog = await Blog.findById(id);
        if (!existingBlog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        let image = existingBlog.image;

        // Handle image updates
        if (aiGeneratedImage && aiGeneratedImage !== 'null') {
            // Use AI generated image
            image = aiGeneratedImage;
        } else if (imgeFile) {
            try {
                // With memory storage, file buffer is directly available
                const fileBuffer = imgeFile.buffer;
                
                if (imagekit) {
                    // NOTE: We are not deleting the old image because we don't store ImageKit fileId in DB.
                    // Deleting by parsing URL is unreliable and causes 'invalid fileId' errors.
                    // Consider storing fileId in the Blog model in the future to safely delete old images.

                    // Upload new image to ImageKit
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: imgeFile.originalname,
                        folder: '/blogs'
                    });

                    // Optimization through ImageKit URL transformation
                    const optimizedImageUrl = imagekit.url({
                        path: response.filePath,
                        transformation: [
                            { quality: 'auto' },
                            { format: 'webp' },
                            { width: '1280' }
                        ]
                    });

                    image = optimizedImageUrl;
                } else {
                    // Fallback to placeholder if ImageKit is not available
                    image = generateFreeThumbnail(title, category);
                }
            } catch (imageKitError) {
                console.log('ImageKit upload failed:', imageKitError.message);
                // Fallback to placeholder if ImageKit fails
                image = generateFreeThumbnail(title, category);
            }
        }

        // Determine final description: if incoming is empty or placeholder, keep existing
        let finalDescription = description;
        const stripHtml = (html) => (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        if (!finalDescription || stripHtml(finalDescription).length === 0) {
            finalDescription = existingBlog.description;
        }

        // Update blog
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            {
                title,
                subTitle,
                description: finalDescription,
                category,
                image,
                isPublished,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        res.json({ success: true, message: 'Blog updated successfully', blog: updatedBlog });
    } catch (error) {
        console.log('Blog update error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addBlog = async (req, res) => {
    try {
        const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog);
        const imgeFile = req.file;
        const aiGeneratedImage = req.body.aiGeneratedImage;
        
        //Check if all required fields are provided
        if(!title || !description || !category) {
            return res.status(400).json({success: false, message: "Title, description, and category are required"})
        }

        let image = null;

        // Handle image upload - prioritize AI generated image, then manual upload, then default
        if(aiGeneratedImage && aiGeneratedImage !== 'null') {
            // Use AI generated image directly
            image = aiGeneratedImage;
        } else if(imgeFile) {
            try {
                // With memory storage, file buffer is directly available
                const fileBuffer = imgeFile.buffer;
                
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
                    // Fallback to placeholder if ImageKit is not available
                    image = generateFreeThumbnail(title, category);
                }
            } catch (imageKitError) {
                console.log("ImageKit upload failed:", imageKitError.message);
                // Fallback to placeholder if ImageKit fails
                image = generateFreeThumbnail(title, category);
            }
        } else {
            // No image provided, use a default placeholder (placehold.co)
            image = "https://placehold.co/1280x720/cccccc/969696?text=No+Image";
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
        res.status(500).json({success: false, message: error.message});
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({isPublished: true});
        res.json({success: true, blogs});
    } catch (error) {
        console.log("Get all blogs error:", error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

export const getBlogById = async (req, res) => {
    try {
        // Support fetching id from URL params, query, or body for compatibility
        const blogId = req.params.blogId || req.query.blogId || req.body.blogId || req.params.id || req.body.id;
        if (!blogId) {
            return res.status(400).json({ success: false, message: "Blog id is required" });
        }
        const blog = await Blog.findById(blogId);
        if(!blog) {
            return res.status(404).json({success: false, message: "Blog not found"});
        }
        res.json({success: true, blog});
    } catch (error) {
        console.log("Get blog by id error:", error.message);
        res.status(500).json({success: false, message: error.message});
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
        res.status(500).json({success: false, message: error.message});
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
        res.status(500).json({success: false, message: error.message});
    }
}

export const addComment = async (req, res) => {
    try {
        const {blog, name, content} = req.body;
        await Comment.create({blog, name, content});
        res.json({success: true, message: "Comment added successfully and waiting for approval"});
    } catch (error) {
        console.log("Add comment error:", error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

export const getComments = async (req, res) => {
    try {
        // Accept blog id from URL params or body with multiple key variants
        const blogId = req.params.blogId || req.body.blogId || req.body.blogID || req.query.blogId;
        if (!blogId) {
            return res.status(400).json({ success: false, message: "Blog id is required" });
        }
        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});
        res.json({success: true, comments});
    } catch (error) {
        console.log("Get comments error:", error.message);
        res.status(500).json({success: false, message: error.message});
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
            return res.status(400).json({ success: false, message: 'Prompt (title/topic) is required' });
        }

        // Check if Gemini API key is available
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ 
                success: false, 
                message: 'Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables.' 
            });
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

        console.log('Generating content with prompt:', fullPrompt.substring(0, 100) + '...');
        
        const content = await main(fullPrompt);
        
        if (!content || content.trim().length === 0) {
            return res.status(500).json({ success: false, message: 'Generated content is empty. Please try again.' });
        }
        
        console.log('Content generated successfully, length:', content.length);
        res.json({ success: true, content });
    } catch (error) {
        console.log("Generate content error:", error.message);
        
        // Provide more specific error messages
        if (error.message.includes('API key') || error.message.includes('authentication')) {
            return res.status(500).json({ 
                success: false, 
                message: 'Gemini API authentication failed. Please check your GEMINI_API_KEY.' 
            });
        } else if (error.message.includes('quota') || error.message.includes('limit')) {
            return res.status(429).json({ 
                success: false, 
                message: 'Gemini API quota exceeded. Please try again later or check your API limits.' 
            });
        }
        
        res.status(500).json({ success: false, message: `Content generation failed: ${error.message}` });
    }
}

export const generateThumbnailAI = async (req, res) => {
    try {
        const { title, category } = req.body;
        
        if (!title || typeof title !== 'string') {
            return res.status(400).json({ success: false, message: 'Blog title is required' });
        }

        // Generate free placeholder image
        const freeImageUrl = generateFreeThumbnail(title, category || '');
        res.json({ 
            success: true, 
            imageUrl: freeImageUrl,
            message: 'Free thumbnail generated successfully!'
        });
    } catch (error) {
        console.log("Generate thumbnail error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const generateThumbnailOptionsAI = async (req, res) => {
    try {
        const { title, category } = req.body;
        
        if (!title || typeof title !== 'string') {
            return res.status(400).json({ success: false, message: 'Blog title is required' });
        }

        // Generate multiple free placeholder images with different colors
        const categories = ['Technology', 'Business', 'Lifestyle', 'Health', 'Startup'];
        const imageUrls = categories.map(cat => generateFreeThumbnail(title, cat));
        
        res.json({ success: true, imageUrls });
    } catch (error) {
        console.log("Generate thumbnail options error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}