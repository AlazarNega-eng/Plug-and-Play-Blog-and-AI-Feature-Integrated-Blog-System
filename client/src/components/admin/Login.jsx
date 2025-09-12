import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext';

const Login = () => {
    const { theme } = useTheme();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async(e) => {
        e.preventDefault();
    }

  return (
    <div className={`flex justify-center items-center h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`w-full max-w-sm p-6 max-md:m-6 border shadow-xl rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-primary/30'}`}>
            <div className='flex flex-col items-center justify-center'>
                <div className='w-full py-6 text-center'>
                    <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        <span className='text-primary'>Admin</span> Login
                    </h1>
                    <p className={`font-light ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Enter your credentials to access the admin dashboard
                    </p>
                </div>
                <form onSubmit={handleSubmit} className={`mt-6 w-full sm:max-w-md ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                    <div className='flex flex-col gap-4'>
                      <label className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}> Email </label>
                        <input 
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email" 
                        placeholder='your email id' 
                        required 
                        className={`border-b-2 p-2 outline-none mb-6 bg-transparent ${theme === 'dark' ? 'border-gray-600 text-gray-200 placeholder-gray-400' : 'border-gray-300 text-gray-900 placeholder-gray-500'}`}
                        />
                    </div>
                    <div className='flex flex-col gap-4'>
                      <label className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}> Password </label>
                        <input 
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password" 
                        placeholder='your password' 
                        required 
                        className={`border-b-2 p-2 outline-none mb-6 bg-transparent ${theme === 'dark' ? 'border-gray-600 text-gray-200 placeholder-gray-400' : 'border-gray-300 text-gray-900 placeholder-gray-500'}`}
                        />
                    </div>
                    <button 
                        type='submit' 
                        className='w-full py-3 font-medium rounded cursor-pointer transition-all'
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
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login