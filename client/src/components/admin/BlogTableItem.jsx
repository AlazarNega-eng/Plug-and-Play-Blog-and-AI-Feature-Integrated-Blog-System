import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const BlogTableItem = ({blog, fetchBlogs, index}) => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const {title, createdAt} = blog;
    const BlogData = new Date(createdAt);

    const {axios} = useAppContext();

    const handleEdit = () => {
        navigate(`/admin/edit-blog/${blog._id}`);
    };

    const deleteBlog = async () => {
      const confirm = window.confirm("Are you sure you want to delete this blog?");
      if(!confirm){
        return;
      }
        try {
            const {data} = await axios.post('/api/blog/delete', { id: blog._id });
            if(data.success){
                toast.success(data.message);
                await fetchBlogs();
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    const togglePublish = async () => {
      try {
        const {data} = await axios.post('/api/blog/toggle-publish', { id: blog._id });    
        if(data.success){
            toast.success(data.message);
            await fetchBlogs();
        }else{
            toast.error(data.message);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
    

  return (
    <tr className={`border-y ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
        <th className={`px-2 py-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}> {index} </th>
        <td className={`px-2 py-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}> {title} </td>
        <td className={`px-2 py-4 max-sm:hidden ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}> {BlogData.toDateString()} </td>
        <td className='px-2 py-4 max-sm:hidden'> 
            <p className={`${blog.isPublished ? "text-green-500" : "text-red-500"}`}>{blog.isPublished ? "Published" : "Unpublished"}</p>
             </td>
             <td className='px-2 py-4 flex text-xs gap-3'>
                <button 
                    onClick={handleEdit} 
                    className={`border px-2 py-0.5 rounded cursor-pointer transition-colors ${theme === 'dark' 
                        ? 'border-blue-500 text-blue-400 hover:bg-blue-900/30 hover:text-blue-300' 
                        : 'border-blue-400 text-blue-600 hover:bg-blue-50'}`}
                >
                    Edit
                </button>
                <button 
                    onClick={togglePublish} 
                    className={`border px-2 py-0.5 rounded cursor-pointer transition-colors ${theme === 'dark' 
                        ? 'border-gray-600 text-gray-200 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                >
                    {blog.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                    onClick={deleteBlog}
                    aria-label="Delete blog"
                    className={`inline-flex items-center justify-center h-8 w-8 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1
                        ${theme === 'dark'
                            ? 'border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-400 focus:ring-red-500/40'
                            : 'border-red-300/60 text-red-600 hover:bg-red-50 hover:border-red-400 focus:ring-red-500/30'}`}
                    title="Delete"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-9 0h10" />
                    </svg>
                </button>
             </td>
       </tr>
  )
}

export default BlogTableItem