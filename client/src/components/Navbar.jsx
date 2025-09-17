import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {
  const { navigate, token, logout } = useAppContext();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-bg border-b border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm'>
      <div className='flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl'>
        <img 
          onClick={() => navigate("/")} 
          src={theme === 'dark' ? assets.logo_light : assets.logo} 
          alt="Zemnay Tech" 
          className='h-16 sm:h-20 lg:h-24 cursor-pointer transition-transform hover:scale-105' 
        />
        <div className='flex items-center gap-3'>
          <button
            onClick={toggleTheme}
            className='rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm transition-all duration-200 bg-secondary-bg text-primary hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center'
            aria-label='Toggle dark/light mode'
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          {token ? (
            <button
              onClick={() => navigate("/admin")}
              className='flex items-center gap-2 rounded-lg text-sm cursor-pointer px-6 py-2.5 transition-all duration-200 font-medium shadow-sm'
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
              Dashboard
              <img src={assets.arrow} className='w-3' alt="arrow" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/admin")}
              className='flex items-center gap-2 rounded-lg text-sm cursor-pointer px-6 py-2.5 transition-all duration-200 font-medium shadow-sm'
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
              Login
              <img src={assets.arrow} className='w-3' alt="arrow" />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar