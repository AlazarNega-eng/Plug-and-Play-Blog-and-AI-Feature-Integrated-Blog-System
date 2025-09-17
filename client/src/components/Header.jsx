import React from 'react'
import { assets } from '../assets/assets'
import { useTheme } from '../contexts/ThemeContext';
import { useAppContext } from '../context/AppContext';
import { useRef } from 'react';


const Header = () => {

  const { theme } = useTheme();

  const inputRef = useRef(null);

  const {setInput, input} = useAppContext();

  const onSubmitHandler = async(e)=>{
    e.preventDefault();
    setInput(inputRef.current.value);
  }

  const onClear = ()=>{
    setInput('');
    inputRef.current.value = '';
  }

  return (
    <div className='mx-8 sm:mx-16 xl:mx-24 relative'>
      <div className='text-center mt-10 mb-8'>
        <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary'>
          <p>New: AI feature integrated</p>
          <img src={assets.star_icon} className='w-2.5' alt='' />
        </div>
        <h1 className="text-3xl sm:text-6xl font-semibold sm:leading-16" style={{color: theme === 'dark' ? '#e5e7eb' : '#000000'}}>
          Your own <span className='text-primary'>blogging </span> <br/> platform
        </h1>
        <p className="my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs" style={{color: theme === 'dark' ? '#d1d5db' : '#000000'}}>
          This is your space to think out loud, to share what matters, and to write without filters. Whether it's one word or a thousand, your story starts right here.
        </p>
        <form 
          onSubmit={onSubmitHandler} 
          className={`max-w-lg mx-auto max-sm:scale-75 rounded-lg overflow-hidden shadow-sm transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className='relative flex items-center'>
            <input 
              ref={inputRef} 
              type='text' 
              placeholder='Search for blogs' 
              required 
              className={`w-full py-3 pl-5 pr-12 outline-none transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary/50' 
                  : 'text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-primary/30 bg-white'
              }`}
            />
            <button 
              type='submit' 
              className={`absolute right-1.5 px-4 py-2 rounded-md transition-all duration-200 flex items-center cursor-pointer ${
                theme === 'dark'
                  ? 'bg-primary hover:bg-primary/80 text-white shadow-md'
                  : 'bg-primary text-white hover:bg-primary/90 shadow-md'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <span className='ml-2 hidden sm:inline'>Search</span>
            </button>
          </div>
        </form>
        <div className='text-center'>
          {input && <button onClick={onClear} className='border font-light text-xs py-1 px-3 mt-5 rounded-sm shadow-custom-sm cursor-pointer '>
            Clear Search
          </button>}
        </div>
      </div>
      <img src={assets.gradientBackground} alt='' className='absolute -top-50 -z-1 opacity-50' />
    </div>
  )
}

export default Header