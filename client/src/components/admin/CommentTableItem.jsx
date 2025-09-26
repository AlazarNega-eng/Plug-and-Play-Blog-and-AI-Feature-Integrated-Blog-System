import React from 'react'
import { assets } from '../../assets/assets';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const CommentTableItem = ({comment, fetchComments}) => {
    const { theme } = useTheme();

    const { blog, createdAt, _id } = comment;
    const BlogDate = new Date(createdAt)

    const{axios} = useAppContext();

    const approveComment = async () => {
        try {
            const {data} = await axios.post('/api/admin/approve-comment', {id: _id});
            if(data.success){
                toast.success(data.message);
                fetchComments();
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }


    const deleteComment = async () => {
        try {
          const confirm = window.confirm("Are you sure you want to delete this comment?");
          if(!confirm){
            return;
          }
            const {data} = await axios.post('/api/admin/delete-comment', { id: _id });
            if(data.success){
                toast.success(data.message);
                fetchComments();
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

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
            {
            comment.isApproved ? (
              <span className={`text-xs rounded-full px-3 py-1 shadow-sm ${theme === 'dark' ? 'border border-green-500/40 bg-green-600/15 text-green-300' : 'border border-green-600 bg-green-50 text-green-700'}`}>
                Approved
              </span>
            ) : (
              <button onClick={approveComment} className={`text-xs rounded-full px-3 py-1 shadow-sm transition-colors focus:outline-none focus:ring-2 ${theme === 'dark' ? 'border border-green-500/40 bg-green-600/20 text-green-300 hover:bg-green-600/30 hover:border-green-500 focus:ring-green-500/40 cursor-pointer' : 'border border-green-600 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-700 focus:ring-green-500/30 cursor-pointer'}`}>
                Approve
              </button>
            )}
            <button onClick={deleteComment} className={`p-1 transition-colors cursor-pointer ${theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'}`}>
              <img className='cursor-pointer w-5 h-5 hover:scale-110 transition-all'
                src={assets.bin_icon} 
                alt="Delete comment" 
              />
            </button>
          </div>
        </td>
    </tr>
  )
}

export default CommentTableItem