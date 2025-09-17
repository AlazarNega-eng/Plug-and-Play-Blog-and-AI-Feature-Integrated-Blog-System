import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [blogs, setBlogs] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Set auth token in axios headers when token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    const fetchBlogs = useCallback(async () => {
        try {
            const { data } = await axios.get('/api/blog/all');
            if (data.success) {
                setBlogs(data.blogs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            if (error.response?.status === 401) {
                // If unauthorized, clear token and redirect to login
                setToken(null);
                navigate('/admin/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to fetch blogs');
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    // Initial data loading
    useEffect(() => {
        const init = async () => {
            await fetchBlogs();
            setIsLoading(false);
        };
        init();
    }, [fetchBlogs]);

    const logout = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        navigate('/admin/login');
        toast.success('Logged out successfully');
    }, [navigate]);

    const value = {
        axios,
        navigate,
        token,
        setToken,
        blogs,
        setBlogs,
        input,
        setInput,
        isLoading,
        logout,
        fetchBlogs,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
