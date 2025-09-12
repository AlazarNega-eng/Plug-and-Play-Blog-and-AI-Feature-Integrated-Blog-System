import React from 'react'
import { useNavigate } from 'react-router-dom'

const BlogCard = ({blog}) => {

    const {title, description, category, image, _id} = blog;
    const navigate = useNavigate();

  return (
  <div onClick={() => navigate(`/blog/${_id}`)} className='w-full rounded-lg overflow-hidden shadow hover:scale-[1.02] hover:shadow-primary/25 duration-300 cursor-pointer' style={{background: 'var(--color-bg)', color: 'var(--color-text)'}}>
        <img src={image} alt="" className='aspect-video w-full object-cover'/>
        <div className='p-5'>
            <span className='inline-block px-3 py-1 mb-3 text-xs font-medium tracking-wide text-primary-700 bg-primary-100 rounded-full hover:bg-primary-200 transition-colors duration-200'>
                {category}
            </span>
            <h5 className='mb-2 text-lg font-semibold' style={{color: 'var(--color-text)'}}>{title}</h5>
            <div className='text-sm' style={{color: 'var(--color-text)'}} dangerouslySetInnerHTML={{__html: description.slice(0, 120)}}></div>
        </div>
    </div>
  )
}

export default BlogCard