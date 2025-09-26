import express from "express";
import { adminLogin, getAllComments, getDashboard, getAllBlogsAdmin, approveCommentById, deleteCommentById} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
import dbCheck from "../middleware/dbCheck.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/comments", auth, dbCheck, getAllComments);
adminRouter.get("/dashboard", auth, dbCheck, getDashboard);
adminRouter.get("/blogs", auth, dbCheck, getAllBlogsAdmin);
adminRouter.post("/delete-comment", auth, deleteCommentById);
adminRouter.post("/approve-comment", auth, approveCommentById);


export default adminRouter;
