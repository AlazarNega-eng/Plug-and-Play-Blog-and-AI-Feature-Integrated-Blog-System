import express from "express";
import { addBlog, getAllBlogs, getBlogById, deleteBlog, togglePublish, addComment, getComments, generateContent } from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("image"), auth, addBlog)
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", auth, deleteBlog);
blogRouter.post("/toggle-publish", auth, togglePublish);
blogRouter.post("/add-comment", addComment);
blogRouter.post("/get-comments", getComments);
// New route supporting URL param as used by client detail page
blogRouter.post("/:blogId/comments", getComments);
blogRouter.post("/generate", auth, generateContent);

export default blogRouter;
