import React from 'react'

const Loader = () => {
  return (
  <div className='flex justify-center items-center h-screen' style={{background: 'var(--color-bg)'}}>
    <div className='animate-spin rounded-full h-16 w-16 border-t-[var(--color-bg)] border-[var(--color-text)] border-4'>
    </div>
  </div>
  )
}

export default Loader