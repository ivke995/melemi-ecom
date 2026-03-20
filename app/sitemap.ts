import type { MetadataRoute } from "next";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import BlogPost from "@/models/BlogPost";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  await connectDB();
  const products = await (Product as any).find({
    isActive: { $ne: false },
    slug: { $exists: true, $ne: "" },
  })
    .select("slug date")
    .lean();

  const posts = await (BlogPost as any).find({
    isPublished: true,
    slug: { $exists: true, $ne: "" },
  })
    .select("slug publishedAt date")
    .lean();

  const productEntries = products.map((product: { slug: string; date?: number }) => ({
    url: `${baseUrl}/proizvod/${product.slug}`,
    lastModified: product.date ? new Date(product.date) : lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogEntries = posts.map(
    (post: { slug: string; publishedAt?: number; date?: number }) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt
        ? new Date(post.publishedAt)
        : post.date
          ? new Date(post.date)
          : lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/prodavnica`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/o-nama`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...blogEntries,
    ...productEntries,
  ];
}
