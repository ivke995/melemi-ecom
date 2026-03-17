import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String },
  content: { type: String, required: true },
  coverImage: { type: String },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Number },
  authorUserId: { type: String, required: true, ref: "user" },
  date: { type: Number, required: true },
});

const BlogPost = mongoose.models.blogPost || mongoose.model("blogPost", blogPostSchema);

export default BlogPost;
