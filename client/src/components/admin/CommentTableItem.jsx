import React from 'react'
import { assets } from '../../assets/assets';
import { useTheme } from '../../contexts/ThemeContext';

const CommentTableItem = ({comment, fetchComment}) => {
    const { theme } = useTheme();

    const { blog, createdAt, _id } = comment;
    const BlogDate = new Date(createdAt)

  return (
    <tr className={`border-y ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
        <td className={`px-6 py-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
          <b className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Blog</b> : {blog.title}
          <br/>
          <br/>
          <b className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Name</b> : {comment.name}
          <br/>
          <b className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>Comment</b> : {comment.content} 
        </td>
        <td className={`px-6 py-4 max-sm:hidden ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
            {BlogDate.toLocaleDateString()}
        </td>
        <td className='px-6 py-4'>
          <div className='flex items-center gap-3'>
            {comment.isApproved ? (
              <span className='text-xs border border-green-500 bg-green-500/10 text-green-500 rounded-full px-3 py-1'>
                Approved
              </span>
            ) : (
              <button className={`text-xs border rounded-full px-3 py-1 transition-colors ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                Approve
              </button>
            )}
            <button className={`p-1 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'}`}>
              <img 
                src={assets.bin_icon} 
                alt="Delete comment" 
                className='w-5 h-5'
              />
            </button>
          </div>
        </td>
    </tr>
  )
}

export default CommentTableItem