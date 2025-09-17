import { useState } from 'react'
import { blog_data, blogCategories } from '../assets/assets'
import { motion } from 'framer-motion'
import BlogCard from './BlogCard'
import { useAppContext } from '../context/AppContext';

const BlogList = () => {

const [menu, setMenu] = useState("All")
const {blogs, input} = useAppContext();

const filteredBlogs = ()=>{
    if(input === '') {
        return blogs;
    }
    return blogs.filter((blog)=> blog.title.toLowerCase().includes(input.toLowerCase()) || blog.category.toLowerCase().includes(input.toLowerCase()));
}

  return (
    <div>
        <div className='flex justify-center flex-wrap gap-2 my-8 px-4 bg-transparent'>
            {blogCategories.map((item) => (
                <button
                    key={item}
                    onClick={() => setMenu(item)}
                    className={`px-3 py-1 text-xs font-medium tracking-wide rounded-full transition-colors duration-200 cursor-pointer ${
                        menu === item 
                            ? 'bg-primary text-white ring-2 ring-primary/60 shadow-sm' 
                            : 'bg-secondary-bg text-primary hover:bg-primary/10 border border-primary/30 hover:border-primary/50'
                    }`}
                    style={menu === item ? {} : {background: 'var(--color-secondary-bg)', color: 'var(--color-primary)'}}
                >
                    {item}
                </button>
            ))}
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
            {filteredBlogs().filter((blog)=> menu === "All" ? true : blog.category === menu)
            .map((blog)=> <BlogCard key={blog._id} blog={blog}/>)}
        </div>
    </div>
  )
}

export default BlogList 