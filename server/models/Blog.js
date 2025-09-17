import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    subTitle: {type: String},
    description: {type: String, required: true},
    category: {type: String, required: true},
    image: {type: String, default: "https://via.placeholder.com/1280x720/cccccc/969696?text=No+Image"},
    isPublished: {type: Boolean, required: true}
}, {
    timestamps: true
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
