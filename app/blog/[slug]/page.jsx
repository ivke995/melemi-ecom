import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("sr-Latn-BA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

const getPost = async (slug) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    const response = await fetch(`${baseUrl}/api/blog/${slug}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.post || null;
  } catch {
    return null;
  }
};

const BlogPost = async ({ params }) => {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-12 pb-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-500 text-left">
            {formatDate(post.publishedAt || post.date)}
          </p>
          <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mt-3">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-gray-600 mt-4 text-lg">{post.excerpt}</p>
          )}
        </div>

        {post.coverImage && (
          <div className="mt-8 rounded-2xl overflow-hidden bg-gray-100 max-w-3xl mx-auto">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-[360px] object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto mt-10 space-y-6 text-gray-700">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-medium text-gray-900 mt-10">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-medium text-gray-900 mt-8">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-medium text-gray-900 mt-6">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-700 leading-relaxed">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  {children}
                </ol>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-orange-200 pl-4 text-gray-600 italic">
                  {children}
                </blockquote>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-orange-600 underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPost;
