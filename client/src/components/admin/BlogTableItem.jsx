import React from 'react'
import { assets } from '../../assets/assets'
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const BlogTableItem = ({blog, fetchBlogs, index}) => {
    const { theme } = useTheme();

    const {title, createdAt} = blog;
    const BlogData =  new Date(createdAt);

    const {axios} = useAppContext();

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
                <button onClick={togglePublish} className={`border px-2 py-0.5 mt-1 rounded cursor-pointer transition-colors ${theme === 'dark' ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}>{blog.isPublished ? "Unpublish" : "Publish"}</button>
                <img onClick={deleteBlog} src={assets.cross_icon} className='w-8 hover:scale-110 transition-all cursor-pointer' alt='' />
             </td>
       </tr>
  )
}

export default BlogTableItem