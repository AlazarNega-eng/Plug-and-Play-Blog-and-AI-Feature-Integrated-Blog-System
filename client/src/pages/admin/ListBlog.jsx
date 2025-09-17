import React, { useEffect, useState } from 'react'
import BlogTableItem from '../../components/admin/BlogTableItem';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';


const ListBlog = () => {
    const { theme } = useTheme();

    const [blogs, setBlogs] = useState([]);
    const {axios} = useAppContext();

    const fetchBlogs = async () =>{
        try {
            const { data } = await axios.get("/api/admin/blogs");
            if (data.success) {
                setBlogs(data.blogs || []);
            } else {
                toast.error(data.message || 'Failed to load blogs');
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            const errorMsg = error.response?.data?.message || 'Failed to load blogs';
            toast.error(errorMsg);
        }
    }

    useEffect(()=>{
        fetchBlogs()
    },[])

  return (
    <div className={`flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50/50'}`}>
        <h1 className={theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}>All blogs</h1>
        <div className={`relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <table className={`w-full text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                <thead className={`text-xs text-left uppercase ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                    <tr>
                        <th scope='col' className='px-2 py-4 xl:px-6'> # </th>
                        <th scope='col' className='px-2 py-4'> Blog Title </th>
                        <th scope='col' className='px-2 py-4 max-sm:hidden'> Date </th>
                        <th scope='col' className='px-2 py-4 max-sm:hidden'> Status </th>
                        <th scope='col' className='px-2 py-4'> Actions </th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((blog, index)=>{
                        return <BlogTableItem key={blog._id} blog={blog}
                        fetchBlogs={fetchBlogs} index={index + 1}/>
                    })}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ListBlog