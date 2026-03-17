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
    const title = payload?.title?.trim();
    const content = payload?.content?.trim();
    const rawSlug = payload?.slug?.trim();
    const excerpt = payload?.excerpt?.trim();
    const coverImage = payload?.coverImage?.trim();
    const isPublished = payload?.isPublished === true;

    if (!title || !content) {
      return NextResponse.json({
        success: false,
        message: "Naslov i sadržaj su obavezni",
      });
    }

    if (hasHtml(content)) {
      return NextResponse.json({
        success: false,
        message: "HTML tagovi nisu dozvoljeni u blog sadržaju",
      });
    }

    let resolvedSlug = slugify(rawSlug || title);
    if (!resolvedSlug) {
      resolvedSlug = `blog-${Date.now()}`;
    }

    await connectDB();
    const existing = await BlogPost.findOne({ slug: resolvedSlug }).lean();
    if (existing) {
      return NextResponse.json({
        success: false,
        message: "Slug je već zauzet",
      });
    }

    const resolvedExcerpt = excerpt || createExcerpt(content);
    const now = Date.now();

    const newPost = await BlogPost.create({
      title,
      slug: resolvedSlug,
      excerpt: resolvedExcerpt,
      content,
      coverImage: coverImage || "",
      isPublished,
      publishedAt: isPublished ? now : null,
      authorUserId: userId,
      date: now,
    });

    return NextResponse.json({
      success: true,
      message: "Blog post je sačuvan",
      post: newPost,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
