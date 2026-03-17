import connectDB from "@/config/db";
import BlogPost from "@/models/BlogPost";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOne({
      slug,
      isPublished: true,
    }).lean();

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Blog nije pronađen" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
