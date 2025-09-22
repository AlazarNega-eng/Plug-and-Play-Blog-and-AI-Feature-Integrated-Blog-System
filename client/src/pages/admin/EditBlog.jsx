import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets, blogCategories } from '../../assets/assets';
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-hot-toast';
import { parse } from 'marked';

const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { axios } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const { theme } = useTheme();
    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState('');
    const [aiGeneratedImage, setAiGeneratedImage] = useState(null);
    const [aiImageLoading, setAiImageLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [category, setCategory] = useState('Startup');
    const [isPublished, setIsPublished] = useState(false);
    const [initialDescription, setInitialDescription] = useState("");
    const [descriptionHtml, setDescriptionHtml] = useState("");
    const [descriptionText, setDescriptionText] = useState("");

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await axios.get(`/api/blog/${id}`);
                if (data.success) {
                    const blog = data.blog;
                    setTitle(blog.title);
                    setSubTitle(blog.subTitle || '');
                    setCategory(blog.category || 'Startup');
                    setIsPublished(blog.isPublished || false);
                    setCurrentImage(blog.image || '');
                    
                    // Store description immediately; we'll populate the editor after Quill initializes
                    const desc = blog.description || '';
                    console.log('Fetched blog description length:', (desc || '').length);
                    setInitialDescription(desc);
                    // Initialize description states immediately so submit works even before Quill updates
                    setDescriptionHtml(desc);
                    // Strip HTML tags for text length check
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = desc;
                    setDescriptionText((tempDiv.textContent || tempDiv.innerText || '').trim());
                } else {
                    toast.error(data.message || 'Failed to load blog');
                    navigate('/admin/list-blog');
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
                toast.error('Failed to load blog');
                navigate('/admin/list-blog');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id, navigate, axios]);

    const setupQuillTheme = () => {
        if (!editorRef.current || !quillRef.current) return;
        
        // Set dark mode styles for Quill editor
        if (theme === 'dark') {
            const editorElement = editorRef.current.querySelector('.ql-editor');
            const toolbarElement = editorRef.current.querySelector('.ql-toolbar');
            
            if (editorElement) {
                editorElement.style.backgroundColor = '#374151';
                editorElement.style.color = '#f3f4f6';
            }
            
            if (toolbarElement) {
                toolbarElement.style.backgroundColor = '#4b5563';
                toolbarElement.style.borderColor = '#6b7280';
                
                const buttons = toolbarElement.querySelectorAll('.ql-picker-label, .ql-picker-item, button');
                buttons.forEach(button => {
                    button.style.color = '#f3f4f6';
                    button.style.backgroundColor = 'transparent';
                });
                
                const pickers = toolbarElement.querySelectorAll('.ql-picker');
                pickers.forEach(picker => {
                    picker.style.color = '#f3f4f6';
                });
            }
        } else {
            // Reset to light mode
            const editorElement = editorRef.current.querySelector('.ql-editor');
            const toolbarElement = editorRef.current.querySelector('.ql-toolbar');
            
            if (editorElement) {
                editorElement.style.backgroundColor = '';
                editorElement.style.color = '';
            }
            
            if (toolbarElement) {
                toolbarElement.style.backgroundColor = '';
                toolbarElement.style.borderColor = '';
                
                const buttons = toolbarElement.querySelectorAll('.ql-picker-label, .ql-picker-item, button');
                buttons.forEach(button => {
                    button.style.color = '';
                    button.style.backgroundColor = '';
                });
                
                const pickers = toolbarElement.querySelectorAll('.ql-picker');
                pickers.forEach(picker => {
                    picker.style.color = '';
                });
            }
        }
    };

    useEffect(() => {
        // Initialize Quill once the editor is in the DOM (after loading finishes)
        if (!loading && editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, { theme: 'snow' });
            // Wire up change listener once
            quillRef.current.on('text-change', () => {
                const html = quillRef.current.root.innerHTML;
                const text = quillRef.current.getText();
                setDescriptionHtml(html);
                setDescriptionText((text || '').trim());
            });
        }

        if (quillRef.current) {
            // Apply theme-specific styles
            setupQuillTheme();

            // If editor has no text yet, populate with initialDescription
            const currentText = quillRef.current.getText()?.trim() || '';
            if (!currentText && (initialDescription || initialDescription === '')) {
                quillRef.current.root.innerHTML = initialDescription || '';
                // Update local states to reflect populated content
                setDescriptionHtml(initialDescription || '');
                setDescriptionText((quillRef.current.getText() || '').trim());
            }
        }
    }, [loading, theme, initialDescription]);

    const generateThumbnailAI = async () => {
        if (!title) return toast.error("Title is required for AI thumbnail generation");
        
        try {
            setAiImageLoading(true);
            const { data } = await axios.post("/api/blog/generate-thumbnail", {
                title: title,
                category: category
            });
            if (data.success) {
                setAiGeneratedImage(data.imageUrl);
                toast.success("Thumbnail generated successfully!");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("AI thumbnail generation error:", error);
            toast.error("Failed to generate AI thumbnail");
        } finally {
            setAiImageLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setAiGeneratedImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Require only title; content can fall back to original if editor empty
        if (!title) {
            return toast.error("Title is required");
        }

        try {
            setIsUpdating(true);
            
            // Determine description to send: if editor has content, use it; otherwise fall back to initialDescription
            const editorHtml = (quillRef.current?.root?.innerHTML || descriptionHtml || "");
            const editorText = (quillRef.current?.getText()?.trim() || descriptionText || "");
            const descriptionToSend = editorText ? editorHtml : (initialDescription || "");

            const blogData = {
                title,
                subTitle,
                description: descriptionToSend,
                category,
                isPublished,
            };

            const formData = new FormData();
            formData.append("blog", JSON.stringify(blogData));
            if (image) {
                formData.append("image", image);
            }
            if (aiGeneratedImage) {
                formData.append("aiGeneratedImage", aiGeneratedImage);
            }

            const { data } = await axios.put(`/api/blog/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (data.success) {
                toast.success("Blog updated successfully!");
                navigate('/admin/list-blog');
            } else {
                toast.error(data.message || "Failed to update blog");
            }
        } catch (error) {
            console.error("Update blog error:", error);
            toast.error("Failed to update blog");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className={`flex-1 min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'}`}>
            <div className="w-full px-6 sm:px-10 lg:px-12 py-8">
                <div className="text-center mb-8">
                    <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        Edit Blog Post
                    </h1>
                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Update your blog post
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-6">
                        <label htmlFor="title" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full px-4 py-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Enter blog title"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="subTitle" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Subtitle
                        </label>
                        <input
                            type="text"
                            id="subTitle"
                            value={subTitle}
                            onChange={(e) => setSubTitle(e.target.value)}
                            className={`w-full px-4 py-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Enter blog subtitle (optional)"
                        />
                    </div>

                    <div className="mb-6">
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Thumbnail
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className={`border-2 border-dashed rounded-lg p-4 text-center ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
                                    {currentImage && !image && !aiGeneratedImage && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-500 mb-2">Current Thumbnail:</p>
                                            <img 
                                                src={
                                                    currentImage.startsWith('http')
                                                        ? currentImage
                                                        : (currentImage.startsWith('/uploads')
                                                            ? currentImage
                                                            : `/uploads/${currentImage}`)
                                                } 
                                                alt="Current blog thumbnail" 
                                                className="max-h-40 mx-auto rounded-md"
                                            />
                                        </div>
                                    )}
                                    {aiGeneratedImage && (
                                        <div className="mb-4">
                                            <p className="text-sm text-green-500 mb-2">AI Generated Thumbnail:</p>
                                            <img 
                                                src={aiGeneratedImage} 
                                                alt="AI generated thumbnail" 
                                                className="max-h-40 mx-auto rounded-md"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="image"
                                        className={`inline-block px-4 py-2 rounded-md cursor-pointer ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                    >
                                        {image ? 'Change Image' : 'Upload New Image'}
                                    </label>
                                    {image && (
                                        <p className="mt-2 text-sm text-green-500">
                                            {image.name} ({(image.size / 1024).toFixed(2)} KB)
                                        </p>
                                    )}
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            onClick={generateThumbnailAI}
                                            disabled={aiImageLoading}
                                            className={`px-4 py-2 rounded-md ${aiImageLoading 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : theme === 'dark' 
                                                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                                                    : 'bg-purple-500 hover:bg-purple-600 text-white'}`}
                                        >
                                            {aiImageLoading ? 'Generating...' : 'Generate AI Thumbnail'}
                                        </button>
                                        {aiImageLoading && (
                                            <div className="mt-2 text-sm text-blue-500">
                                                Generating thumbnail, please wait...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="category" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Category
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={`w-full px-4 py-2 rounded-md border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        >
                            {blogCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="isPublished"
                                checked={isPublished}
                                onChange={(e) => setIsPublished(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isPublished" className={`ml-2 block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Publish this blog
                            </label>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Content <span className="text-red-500">*</span>
                            </label>
                        </div>
                        <div 
                            ref={editorRef} 
                            className={`min-h-[300px] ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} rounded-md border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}
                        ></div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/list-blog')}
                            className={`px-6 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className={`px-6 py-2 rounded-md ${isUpdating 
                                ? 'bg-blue-400 cursor-not-allowed' 
                                : theme === 'dark' 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                        >
                            {isUpdating ? 'Updating...' : 'Update Blog'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBlog;
