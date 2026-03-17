import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import BlogPost from "@/models/BlogPost";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Niste ovlašćeni" });
    }

    await connectDB();
    const posts = await BlogPost.find({ authorUserId: userId })
      .sort({ date: -1 })
      .lean();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
