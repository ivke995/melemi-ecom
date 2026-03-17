import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("sr-Latn-BA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

const getPosts = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    const response = await fetch(`${baseUrl}/api/blog/list`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.posts || [];
  } catch {
    return [];
  }
};

const Blog = async () => {
  const posts = await getPosts();

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex flex-col items-end pt-12">
          <p className="text-2xl font-medium">Blog</p>
          <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
        </div>

        {posts.length === 0 ? (
          <div className="py-16 text-gray-500">
            Trenutno nema objavljenih blogova.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 pb-14 w-full">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="group border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition"
              >
                <div className="relative h-44 bg-gray-100">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-gray-100" />
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-gray-500">
                    {formatDate(post.publishedAt || post.date)}
                  </p>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-600 transition">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600">{post.excerpt}</p>
                  <span className="text-sm text-orange-600">
                    Pročitaj više
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Blog;
