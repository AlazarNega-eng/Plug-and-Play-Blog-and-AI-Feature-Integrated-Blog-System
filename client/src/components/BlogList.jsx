import React, { useState } from 'react'
import { blog_data, blogCategories } from '../assets/assets'
import { motion } from 'motion/react'
import BlogCard from './BlogCard'

const BlogList = () => {

const [menu, setMenu] = useState("All")

  return (
    <div>
        <div className='flex justify-center flex-wrap gap-2 my-8 px-4' style={{background: 'var(--color-bg)'}}>
            {blogCategories.map((item) => (
                <button
                    key={item}
                    onClick={() => setMenu(item)}
                    className={`px-3 py-1 text-xs font-medium tracking-wide rounded-full transition-colors duration-200 ${
                        menu === item 
                            ? 'bg-primary text-white' 
                            : 'bg-secondary-bg text-primary hover:bg-primary/10'
                    }`}
                    style={menu === item ? {} : {background: 'var(--color-secondary-bg)', color: 'var(--color-primary)'}}
                >
                    {item}
                </button>
            ))}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40' style={{background: 'var(--color-bg)'}}>
            {blog_data.filter((blog)=> menu === "All" ? true : blog.category === menu)
            .map((blog)=> <BlogCard key={blog._id} blog={blog}/>)}
        </div>
    </div>
  )
}

export default BlogList 