import React from 'react'
import { assets, footer_data } from '../assets/assets'
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32' style={{background: 'var(--color-secondary-bg)', color: 'var(--color-text)'}}>
      <div className='flex flex-col md:flex-row justify-between items-start gap-10 py-10 border-b border-gray-500/30' style={{color: 'var(--color-text)'}}>
        <div>
          <img 
            src={theme === 'dark' ? assets.logo_light : assets.logo} 
            alt="Zemnay Tech" 
            className='w-32 sm:w-44 cursor-pointer' 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          />
          <p className='max-w-[410px] mt-6' style={{color: 'var(--color-text)'}}>Zemnay Tech is your go-to destination for the latest in technology and innovation. Stay updated with the latest trends and insights in the world of tech.</p>
        </div>
        <div className='flex flex-wrap gap-5 justify-between w-full md:w-[45%]'>
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className='font-semibold text-base md:mb-5 mb-2' style={{color: 'var(--color-text)'}}>{section.title}</h3>
              <ul className='text-sm space-y-1' style={{color: 'var(--color-text)'}}>
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href='#' className='hover:underline transition' style={{color: 'var(--color-link)'}}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
  <p className='py-4 text-center text-sm md:text-base' style={{color: 'var(--color-text)'}}>© 2025 Plug-and-Play Blog. All rights reserved.</p>
    </div>
  )
}

export default Footer