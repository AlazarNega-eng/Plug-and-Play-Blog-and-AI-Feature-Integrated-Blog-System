import express from "express";
import { addBlog, updateBlog, getAllBlogs, getBlogById, deleteBlog, togglePublish, addComment, getComments, generateContent, generateThumbnailAI, generateThumbnailOptionsAI } from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.put("/update/:id", upload.single("image"), auth, updateBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", auth, deleteBlog);
blogRouter.post("/toggle-publish", auth, togglePublish);
blogRouter.post("/add-comment", addComment);
blogRouter.post("/get-comments", getComments);
// New route supporting URL param as used by client detail page
blogRouter.post("/:blogId/comments", getComments);
blogRouter.post("/generate", auth, generateContent);
blogRouter.post("/generate-thumbnail", auth, generateThumbnailAI);
blogRouter.post("/generate-thumbnail-options", auth, generateThumbnailOptionsAI);

export default blogRouter;
