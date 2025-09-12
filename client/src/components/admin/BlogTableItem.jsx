import React from 'react'
import { assets } from '../../assets/assets'
import { useTheme } from '../../contexts/ThemeContext';


const BlogTableItem = ({blog,fetchBlog,index}) => {
    const { theme } = useTheme();

    const {title, createdAt} = blog;
    const BlogData =  new Date(createdAt);

  return (
    <tr className={`border-y ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
        <th className={`px-2 py-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}> {index} </th>
        <td className={`px-2 py-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}> {title} </td>
        <td className={`px-2 py-4 max-sm:hidden ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}> {BlogData.toDateString()} </td>
        <td className='px-2 py-4 max-sm:hidden'> 
            <p className={`${blog.isPublished ? "text-green-500" : "text-red-500"}`}>{blog.isPublished ? "Published" : "Unpublished"}</p>
             </td>
             <td className='px-2 py-4 flex text-xs gap-3'>
                <button className={`border px-2 py-0.5 mt-1 rounded cursor-pointer transition-colors ${theme === 'dark' ? 'border-gray-600 text-gray-200 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}>{blog.isPublished ? "Unpublish" : "Publish"}</button>
                <img src={assets.cross_icon} className='w-8 hover:scale-110 transition-all cursor-pointer' alt='' />
             </td>
       </tr>
  )
}

export default BlogTableItem