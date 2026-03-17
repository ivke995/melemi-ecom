import connectDB from "@/config/db";
import BlogPost from "@/models/BlogPost";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const posts = await BlogPost.find({ isPublished: true })
      .sort({ publishedAt: -1, date: -1 })
      .lean();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
