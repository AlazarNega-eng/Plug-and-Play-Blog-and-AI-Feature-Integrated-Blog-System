import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import { assets } from '../../assets/assets';

const Login = () => {
    const { theme } = useTheme();
    const { axios, setToken, token } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (token) {
            navigate('/admin', { replace: true });
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        
        try {
            const { data } = await axios.post('/api/admin/login', { email, password });
            
            if (data?.success) {
                const authToken = `Bearer ${data.token}`;
                setToken(authToken);
                localStorage.setItem('token', authToken);
                axios.defaults.headers.common['Authorization'] = authToken;
                
                toast.success('Login successful!');
                
                // Redirect to the intended page or default to admin dashboard
                const from = location.state?.from?.pathname || '/admin';
                navigate(from, { replace: true });
            } else {
                throw new Error(data?.message || 'Login failed');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      <div className="container mx-auto px-4 pt-42 pb-12 flex justify-center items-start">
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
                        disabled={loading}
                        className='w-full py-3 font-medium rounded cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                        style={{
                            backgroundColor: '#5044E5',
                            color: '#ffffff'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#4338ca';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#5044E5';
                            }
                        }}
                    > 
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Login