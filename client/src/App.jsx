import React from "react"; 
import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddBlog from "./pages/admin/AddBlog";
import ListBlog from "./pages/admin/ListBlog";
import Comments from "./pages/admin/Comments";
import Login from "./components/admin/Login";
import 'quill/dist/quill.snow.css'


const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? "" : "pt-20"}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/blog/:id' element={<Blog />} />
          <Route path='/admin' element={true ? <Layout /> : <Login />}>
            <Route index element={<Dashboard />} />
            <Route path='addblog' element={<AddBlog />} />
            <Route path='listblog' element={<ListBlog />} />
            <Route path='comments' element={<Comments />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}

export default App