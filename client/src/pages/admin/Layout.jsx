import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
  const { theme } = useTheme();
  const { logout } = useAppContext();
  const navigate = useNavigate();

  return (
<>
  <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200' style={{background: 'var(--color-bg)', color: 'var(--color-text)'}}>
    <img 
      src={theme === 'dark' ? assets.logo_light : assets.logo} 
      alt="Zemnay Tech" 
      className='w-32 sm:w-40 cursor-pointer h-auto'
      onClick={() => navigate("/")}
    />
    <button 
      onClick={logout} 
      className='flex items-center gap-2 text-sm px-6 py-2.5 transition-all duration-200 font-medium shadow-sm rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer'
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
      </svg>
      <span>Logout</span>
    </button>
  </div>

    <div className='flex h-[calc(100vh-70px)]'>
       <Sidebar />
       <Outlet />     
    </div>
</>
  )
}

export default Layout