import React, { useEffect } from "react"; 
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddBlog from "./pages/admin/AddBlog";
import ListBlog from "./pages/admin/ListBlog";
import EditBlog from "./pages/admin/EditBlog";
import Comments from "./pages/admin/Comments";
import Login from "./components/admin/Login";
import 'quill/dist/quill.snow.css'
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useAppContext();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? "" : "pt-20"}>
        <Toaster position="top-right" />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/blog/:id' element={<Blog />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="addblog" element={<AddBlog />} />
            <Route path="listblog" element={<ListBlog />} />
            <Route path="edit-blog/:id" element={<EditBlog />} />
            <Route path="comments" element={<Comments />} />
          </Route>
          <Route path="/admin/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

export default App;