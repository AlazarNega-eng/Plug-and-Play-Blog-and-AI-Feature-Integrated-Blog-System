import React from 'react'

const Newsletter = () => {
  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2' style={{background: 'var(--color-secondary-bg)', color: 'var(--color-text)'}}>
      <h1 className='md:text-4xl text-2xl font-semibold' style={{color: 'var(--color-text)'}}>Never Miss a Blog!</h1>
      <p className='md:text-lg pb-8' style={{color: 'var(--color-text)'}}>Suscribe to get the latest blog, new tech, and exclusive offers.</p>
      <form className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12'>
        <input className='border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3' style={{color: 'var(--color-text)', background: 'var(--color-bg)'}} type="email" placeholder='Enter your email' required/>
        <button 
          className='md:px-12 px-8 h-full transition-all cursor-pointer' 
          type='submit'
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
          Suscribe
        </button>
      </form>
    </div>
  )
}

export default Newsletter