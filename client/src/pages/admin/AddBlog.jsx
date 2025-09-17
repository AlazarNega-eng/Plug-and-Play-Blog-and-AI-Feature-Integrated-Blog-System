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
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }finally{
            setLoading(false);
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

            const {data} = await axios.post("/api/blog/add", formData);
            if(data.success){
                toast.success(data.message);
                setTitle("");
                setSubTitle("");
                setCategory('Startup');
                setImage(false);
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
   <form onSubmit={onSubmitHandler} className={`flex-1 h-full overflow-scroll ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-blue-50/50 text-gray-600'}`}>
    <div className={`w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}>Upload thumbnail</p>
        <label htmlFor="image">
            <img src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" className='mt-2 h-16 rounded cursor-pointer'/>
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required/>
        </label>

        <p className={`mt-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Blog Title</p>
        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" required className={`w-full max-w-lg mt-2 p-2 border rounded-md outline-none ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'}`}/>

        <p className={`mt-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Blog Subtitle</p>
        <input value={subTitle} onChange={(e) => setSubTitle(e.target.value)} type="text" required className={`w-full max-w-lg mt-2 p-2 border rounded-md outline-none ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'}`}/>

        <p className={`mt-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Blog Description</p>
        <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
            <div ref={editorRef} className={theme === 'dark' ? 'bg-gray-700' : ''}></div>
            {loading && ( <div className='absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2'>
            <div className='w-8 h-8 animate-spin rounded-full border-2 border-t-white'></div>
            </div>
            )}
            <button disabled={loading} type='button' onClick={generateContent} className={`absolute bottom-1 right-2 ml-2 text-xs text-white px-4 py-1.5 rounded hover:underline cursor-pointer ${theme === 'dark' ? 'bg-gray-600' : 'bg-black/70'}`}>Generate with AI</button>
        </div>
        <p className={`mt-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Blog Category</p>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={`mt-2 py-2 px-3 border rounded outline-none ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'text-gray-500 border-gray-300'}`}>
            <option value="">Select Category</option>
            {blogCategories.map((item, index) => (
                <option key={index} value={item}>{item}</option>
            ))}
        </select>
    <div className={`flex items-center gap-2 mt-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
        <p>Publish Now</p>
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className='scale-125 cursor-pointer'/>
    </div>

    <button disabled={isAdding} 
      type='submit' 
      className='mt-8 w-40 h-10 rounded cursor-pointer px-5 py-2 transition-colors'
      style={{
        backgroundColor: '#5044E5',
        color: '#ffffff'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#4338ca';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#5044E5';
      }}
    >
      {isAdding ? "Adding..." : "Add Blog"}
    </button>
    </div>
   </form>
  )
}

export default AddBlog