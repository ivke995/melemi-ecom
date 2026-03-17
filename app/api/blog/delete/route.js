import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import BlogPost from "@/models/BlogPost";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Niste ovlašćeni" });
    }

    const payload = await request.json();
    const postId = payload?.postId;
    if (!postId) {
      return NextResponse.json({
        success: false,
        message: "Blog nije pronađen",
      });
    }

    await connectDB();
    const deletedPost = await BlogPost.findOneAndDelete({
      _id: postId,
      authorUserId: userId,
    });

    if (!deletedPost) {
      return NextResponse.json({
        success: false,
        message: "Blog nije pronađen",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Blog post je obrisan",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
