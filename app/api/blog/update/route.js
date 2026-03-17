import connectDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import { createExcerpt, slugify } from "@/lib/blog";
import BlogPost from "@/models/BlogPost";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const hasHtml = (value) => /<\/?[a-z][\s\S]*>/i.test(value || "");

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Niste ovlašćeni" });
    }

    const payload = await request.json();
    const postId = payload?.postId;
    const title = payload?.title?.trim();
    const content = payload?.content?.trim();
    const rawSlug = payload?.slug?.trim();
    const excerpt = payload?.excerpt?.trim();
    const coverImage = payload?.coverImage?.trim();
    const isPublished = payload?.isPublished;

    if (!postId || !title || !content) {
      return NextResponse.json({
        success: false,
        message: "Nedostaju obavezna polja",
      });
    }

    if (hasHtml(content)) {
      return NextResponse.json({
        success: false,
        message: "HTML tagovi nisu dozvoljeni u blog sadržaju",
      });
    }

    await connectDB();
    const post = await BlogPost.findOne({ _id: postId, authorUserId: userId });
    if (!post) {
      return NextResponse.json({
        success: false,
        message: "Blog nije pronađen",
      });
    }

    const resolvedSlug = slugify(rawSlug || title) || post.slug;
    const existingSlug = await BlogPost.findOne({
      slug: resolvedSlug,
      _id: { $ne: postId },
    }).lean();

    if (existingSlug) {
      return NextResponse.json({
        success: false,
        message: "Slug je već zauzet",
      });
    }

    const resolvedExcerpt = excerpt || createExcerpt(content);
    const shouldPublish =
      typeof isPublished === "boolean" ? isPublished : post.isPublished;
    const publishedAt = shouldPublish
      ? post.publishedAt || Date.now()
      : null;

    const updatedPost = await BlogPost.findByIdAndUpdate(
      postId,
      {
        title,
        slug: resolvedSlug,
        excerpt: resolvedExcerpt,
        content,
        coverImage: coverImage || "",
        isPublished: shouldPublish,
        publishedAt,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Blog post je ažuriran",
      post: updatedPost,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
