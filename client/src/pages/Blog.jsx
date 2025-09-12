import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import Moment from 'moment'
import { assets, comments_data, blog_data } from '../assets/assets'


const Blog = () => {

  const {id} = useParams();

const [data, setData] = useState(null)
const [comments, setComments] = useState([])
const [name, setName] = useState("")
const [content, setContent] = useState("")
const [loading, setLoading] = useState(true)

const fetchBlog = async () => {
   const data = blog_data.find(item => item._id === id)
   setData(data)
   setLoading(false)  }

const fetchComments = async () => {
   setComments(comments_data)
}

const addComment = async (e) => {
   e.preventDefault()
}

useEffect(() => {
  fetchBlog()
  fetchComments()
}, [])

  return data ? (
    <div>
      <div className='relative' style={{background: 'var(--color-bg)', color: 'var(--color-text)'}}>
        <img src={assets.gradientbackground} alt="" className='absolute -top-50 -z-1 opacity-50'/>

  <div className='text-center pt-8' style={{color: 'var(--color-text)'}}>
          <p className='text-primary py-4 font-medium'>Published on {Moment(data.createdAt).format("MMMM Do YYYY")}</p>
          <h1 className='text-2xl font-semibold sm:text-5xl max-w-2xl mx-auto' style={{color: 'var(--color-text)'}}>{data.title}</h1>
          <h2 className='my-5 max-w-lg truncate mx-auto' style={{color: 'var(--color-text)'}}>{data.subTitle}</h2>
          <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary'>Michael Engida</p>
        </div>

  <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6' style={{color: 'var(--color-text)'}}>
          <img src={data.image} alt="" className='rounded-3xl mb-5'/>

          <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML={{__html: data.description}}></div>

          {/*comments section*/}
          <div className='mt-14 mb-10 max-w-3xl mx-auto' style={{color: 'var(--color-text)'}}>
            <p className='font-semibold text-lg mb-4' style={{color: 'var(--color-text)'}}>Comments {comments.length}</p>
            <div className='flex flex-col gap-4'>
              {comments.map((item, index) => (
                <div key={index} className='relative bg-primary/2 border border-primary/5 max-w-xl rounded' style={{color: 'var(--color-text)'}}>
                  <div className='flex items-center gap-2 mb-2'>
                    <img src={assets.user_icon} alt="" className='w-6'/>
                    <p className='font-medium' style={{color: 'var(--color-text)'}}>{item.name}</p>
                  </div>
                  <p className='text-sm max-w-md ml-8' style={{color: 'var(--color-text)'}}>{item.content}</p>
                  <div className='absolute right-4 bottom-3 flex items-center gap-2 text-xs' style={{color: 'var(--color-text)'}}>
                    {Moment(item.createdAt).fromNow()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/*Add comment Section*/}
  <div className='max-w-3xl mx-auto' style={{color: 'var(--color-text)'}}>
  <p className='font-semibold text-lg mb-4' style={{color: 'var(--color-text)'}}>Add your comment</p>
        <form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Name' required className='w-full p-2 border border-gray-300 rounded-md outline-none' style={{color: 'var(--color-text)', background: 'var(--color-bg)'}}/>
          <textarea onChange={(e) => setContent(e.target.value)} value={content} placeholder='Comment' required className='w-full p-2 border border-gray-300 rounded-md outline-none h-48' style={{color: 'var(--color-text)', background: 'var(--color-bg)'}}/>
          <button type='submit' className='bg-primary text-white px-8 p-2 m-1.5 rounded hover:scale-102 transition-all cursor-pointer'>Add Comment</button>
        </form>
      </div>
      
      {/*Share Buttons*/}
  <div className='my-24 max-w-3xl mx-auto' style={{color: 'var(--color-text)'}}>
        <p className='font-semibold text-lg my-4'>Share this article on social media</p>
        <div className='flex items-center gap-4'>
          <img src={assets.facebook_icon} width={50} alt="Facebook"/>
          <img src={assets.twitter_icon} width={50} alt="Twitter"/>
          <img src={assets.googleplus_icon} width={50} alt="Google+"/>
        </div>
      </div>
      <Footer/>
    </div>
  ) : <Loader/>
}

export default Blog 