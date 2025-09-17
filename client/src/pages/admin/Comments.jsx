import React, { useEffect, useState } from 'react'
import CommentTableItem from '../../components/admin/CommentTableItem'
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const Comments = () => {
    const { theme } = useTheme();

const [comments, setComments] = useState([])
const [filter, setFilter] = useState('Not Approved')

const {axios} = useAppContext();

const fetchComments = async ()=>{
    try {
        const {data} = await axios.get("/api/admin/comments");
        data.success ? setComments(data.comments) : toast.error(data.message);
    } catch (error) {
        toast.error("Something went wrong");
    }
}

useEffect(()=>{
    fetchComments()
},[])
  return (
    <div className={`flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50/50'}`}>
        <div className='flex justify-between items-center max-w-3xl'>
            <h1 className={theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}>Comments</h1>
            <div className='flex gap-4'>
                <button onClick={()=> setFilter('Approved')} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs transition-colors ${filter === 'Approved' ? 'text-primary border-primary' : theme === 'dark' ? 'text-gray-300 border-gray-600 hover:border-gray-500' : 'text-gray-700 border-gray-300 hover:border-gray-400'}`}>Approved</button>
                <button onClick={()=> setFilter('Not Approved')} className={`shadow-custom-sm border rounded-full px-4 py-1 cursor-pointer text-xs transition-colors ${filter === 'Not Approved' ? 'text-primary border-primary' : theme === 'dark' ? 'text-gray-300 border-gray-600 hover:border-gray-500' : 'text-gray-700 border-gray-300 hover:border-gray-400'}`}>Not Approved</button>
            </div>
        </div>
        <div className={`relative h-4/5 max-w-3xl overflow-x-auto mt-4 shadow rounded-lg scrollbar-hide ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
           <table className={`w-full text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
            <thead className={`text-xs text-left uppercase ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                <tr>
                   <th scope='col' className='px-6 py-3'> Blog Title & Comment </th>
                   <th scope='col' className='px-6 py-3 max-sm:hidden'> Date </th> 
                   <th scope='col' className='px-6 py-3'> Action </th>  
                </tr>    
            </thead>
            <tbody>
                {comments.filter((comment)=>{
                    if(filter === "Approved") return comment.isApproved === true;
                    return comment.isApproved === false;
                }).map((comment, index)=> <CommentTableItem key={comment._id} 
                comment={comment} index={index + 1} fetchComments={fetchComments} />)}
            </tbody>
           </table>
        </div>
    </div>
  )
}

export default Comments