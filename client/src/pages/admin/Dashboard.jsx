import React from 'react'
import { assets } from '../../assets/assets'
import { dashboard_data } from '../../assets/assets'
import { useState } from 'react'
import { useEffect } from 'react'
import BlogTableItem from '../../components/admin/BlogTableItem'
import { useTheme } from '../../contexts/ThemeContext'



const Dashboard = () => {
   const { theme } = useTheme();

   const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: []
   }) 

   const fetchDashboardData = async () => {
    setDashboardData(dashboard_data)
   }

   useEffect(() => {
    fetchDashboardData()
   }, [])

  return (
    <div className={`flex-1 p-4 md:p-10 ${theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50/50'}`}>
       <div className='flex flex-wrap gap-4'>
        <div className={`flex items-center gap-4 p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <img src={assets.dashboard_icon_1} alt=""/>
        <div>
          <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>{dashboardData.blogs}</p>
          <p className={`font-light ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>Blog</p>
        </div>
        </div>
        <div className={`flex items-center gap-4 p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <img src={assets.dashboard_icon_2} alt=""/>
        <div>
          <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>{dashboardData.comments}</p>
          <p className={`font-light ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>Comments</p>
        </div>
        </div>
        <div className={`flex items-center gap-4 p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
        <img src={assets.dashboard_icon_3} alt=""/>
        <div>
          <p className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>{dashboardData.drafts}</p>
          <p className={`font-light ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>Drafts</p>
        </div>
        </div>
       </div>

       <div>
        <div className={`flex items-center gap-3 m-4 mt-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
            <img src={assets.dashboard_icon_4} alt=""/>
            <p>Latest Blogs</p>
        </div>

        <div className={`relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
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
                    {dashboardData.recentBlogs.map((blog, index)=>{
                        return <BlogTableItem key={blog._id} blog={blog}
                        fetchBlogs={fetchDashboardData} index={index + 1}/>
                    })}
                </tbody>
            </table>
        </div>
       </div>
    </div>
  )
}

export default Dashboard