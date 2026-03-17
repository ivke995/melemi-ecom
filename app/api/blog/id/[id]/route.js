import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import BlogPost from "@/models/BlogPost";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Niste ovlašćeni" });
    }

    await connectDB();
    const post = await BlogPost.findOne({
      _id: params.id,
      authorUserId: userId,
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
