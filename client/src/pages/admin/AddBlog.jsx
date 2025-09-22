import React, { useState, useRef, useEffect } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-hot-toast';
import { parse } from 'marked';



const AddBlog = () => {

    const {axios} = useAppContext();
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    const { theme } = useTheme();

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const [image, setImage] = useState(false);
    const [aiGeneratedImage, setAiGeneratedImage] = useState(null);
    const [aiImageLoading, setAiImageLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [category, setCategory] = useState('Startup');
    const [isPublished, setIsPublished] = useState(false);

    const generateContent = async () => {
        if(!title) return toast.error("Title is required");
        
        try {
            setLoading(true);
            const {data} = await axios.post("/api/blog/generate", {prompt: title});
            if(data.success){
                quillRef.current.root.innerHTML = parse(data.content);
                toast.success("Blog content generated successfully!");
            }else{
                // Provide helpful error messages for common issues
                if(data.message.includes('API key')) {
                    toast.error(
                        <div className="text-left">
                            <div className="font-semibold mb-2">Gemini API Key Missing</div>
                            <div className="text-sm">Please add GEMINI_API_KEY to your server environment variables.</div>
                        </div>,
                        { duration: 6000 }
                    );
                } else if(data.message.includes('quota')) {
                    toast.error("Gemini API quota exceeded. Please try again later.");
                } else {
                toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error("Something went wrong");
        }finally{
            setLoading(false);
        }
    }

    const generateThumbnailAI = async () => {
        if(!title) return toast.error("Title is required for AI thumbnail generation");
        
        try {
            setAiImageLoading(true);
            const {data} = await axios.post("/api/blog/generate-thumbnail", {
                title: title,
                category: category
            });
            if(data.success){
                setAiGeneratedImage(data.imageUrl);
                toast.success("Free thumbnail generated successfully!", {
                    icon: '🆓'
                });
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            console.error("AI thumbnail generation error:", error);
            toast.error("Failed to generate AI thumbnail");
        }finally{
            setAiImageLoading(false);
        }
    }

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            setIsAdding(true);

            const blog ={
                title,
                subTitle,
                description: quillRef.current.root.innerHTML,
                category,
                isPublished,
            }

            const formData = new FormData();
            formData.append("blog", JSON.stringify(blog));
            formData.append("image", image);
            formData.append("aiGeneratedImage", aiGeneratedImage);

            const {data} = await axios.post("/api/blog/add", formData);
            if(data.success){
                toast.success(data.message);
                setTitle("");
                setSubTitle("");
                setCategory('Startup');
                setImage(false);
                setAiGeneratedImage(null);
                setIsPublished(false);
                quillRef.current.root.innerHTML = "";
            }else{
                toast.error(data.message);
            }
        } catch (error) {
          toast.error("Something went wrong");  
        }finally{
            setIsAdding(false);
        }
    }

    useEffect(()=> {
        //Initiate Quill only once
        if(!quillRef.current && editorRef.current){
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
            })
            
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
                    
                    // Style toolbar buttons
                    const buttons = toolbarElement.querySelectorAll('.ql-picker-label, .ql-picker-item, button');
                    buttons.forEach(button => {
                        button.style.color = '#f3f4f6';
                        button.style.backgroundColor = 'transparent';
                    });
                    
                    // Style dropdowns
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
        }
    }, [theme])
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Create New Blog Post
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Share your thoughts with the world
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="max-w-4xl mx-auto">
          <div className={`rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            
            {/* Thumbnail Section - Compact */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'}`}>
                    <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      Blog Thumbnail
                    </h2>
                  </div>
                </div>
                
                {/* AI Generation Button */}
                <button
                  type="button"
                  onClick={generateThumbnailAI}
                  disabled={aiImageLoading || !title}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    aiImageLoading || !title
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {aiImageLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate AI
                    </>
                  )}
                </button>
              </div>

              {/* Compact Thumbnail Preview */}
              <div className="flex items-center gap-4">
                <label htmlFor="image" className="cursor-pointer group">
                  <div className={`relative overflow-hidden rounded-lg border-2 border-dashed transition-all duration-300 group-hover:border-blue-400 ${
                    aiGeneratedImage || image 
                      ? 'border-gray-300 dark:border-gray-600' 
                      : theme === 'dark' 
                        ? 'border-gray-600 hover:border-blue-500' 
                        : 'border-gray-300 hover:border-blue-400'
                  }`}>
                    <div className="w-32 h-20 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                      {aiGeneratedImage ? (
                        <img 
                          src={aiGeneratedImage} 
                          alt="AI Generated Thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      ) : image ? (
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt="Uploaded thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <svg className={`mx-auto h-6 w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-300'}`} stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* AI Generated Badge */}
                    {aiGeneratedImage && (
                      <div className="absolute -top-1 -right-1">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          🤖
                        </span>
                      </div>
                    )}
                  </div>
                  <input 
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                      setAiGeneratedImage(null);
                    }} 
                    type="file" 
                    id='image' 
                    accept="image/*"
                    className="hidden"
                  />
                </label>
                
                <div className="flex-1">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                    Click thumbnail to upload or use AI generation
                  </p>
                  {aiGeneratedImage && (
                    <button
                      type="button"
                      onClick={() => setAiGeneratedImage(null)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear
                    </button>
                  )}
                  {!title && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Enter title first for AI generation
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Blog Title *
                  </label>
                  <input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    type="text" 
                    required 
                    placeholder="Enter your blog title..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
        </div>

                {/* Category */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                    Category *
                  </label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
            {blogCategories.map((item, index) => (
                <option key={index} value={item}>{item}</option>
            ))}
        </select>
                </div>
              </div>
              
              {/* Subtitle */}
              <div className="mt-4">
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                  Blog Subtitle
                </label>
                <input 
                  value={subTitle} 
                  onChange={(e) => setSubTitle(e.target.value)} 
                  type="text" 
                  placeholder="Enter a catchy subtitle..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
    </div>

            {/* Content Section - Google Docs Style */}
            <div className="p-6">
              {/* Header Section */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-green-600/20' : 'bg-green-100'}`}>
                    <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      Blog Content
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Write your blog content or generate with AI
                    </p>
                  </div>
                </div>
                
                {/* Publish Toggle - Separate Row */}
                <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        Publish Immediately
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Make this blog post visible to readers right away
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-auto">
                      <input 
                        type="checkbox" 
                        checked={isPublished} 
                        onChange={(e) => setIsPublished(e.target.checked)} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Google Docs Style Editor */}
              <div className={`relative rounded-xl border-2 overflow-hidden shadow-lg ${theme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                {/* Editor Toolbar */}
                <div className={`border-b px-4 py-3 ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-md text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                        📝 Document
                      </div>
                      <div className={`px-3 py-1 rounded-md text-sm font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                        ✨ AI Ready
                      </div>
                    </div>
                    
                    <button 
                      disabled={loading || !title} 
                      type='button' 
                      onClick={generateContent} 
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        loading || !title
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Generate with AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Editor Content */}
                <div className="relative">
                  <div 
                    ref={editorRef} 
                    className={`min-h-[500px] p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '16px',
                      lineHeight: '1.6'
                    }}
                  ></div>
                  
                  {loading && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm'>
                      <div className='flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-xl border'>
                        <div className='w-6 h-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent'></div>
                        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Generating content...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className={`p-8 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {title && (
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Ready to publish
                    </span>
                  )}
                </div>
                
                <button 
                  disabled={isAdding || !title} 
                  type='submit' 
                  className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    isAdding || !title
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Publish Blog
                    </>
                  )}
    </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBlog