import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";
import Image from "next/image";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("sr-Latn-BA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

const buildDescription = (post) => {
  const raw = post?.excerpt || post?.content || "";
  const cleaned = raw.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  return cleaned.length > 160 ? `${cleaned.slice(0, 157)}...` : cleaned;
};

const toIsoDate = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
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

export async function generateMetadata({ params }) {
  const { slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Blog",
    };
  }

  const description = buildDescription(post);
  const publishedIso = toIsoDate(post.publishedAt || post.date);
  const updatedIso = toIsoDate(post.date || post.publishedAt);
  const images = post.coverImage
    ? [{ url: post.coverImage, alt: post.title }]
    : undefined;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      url: `${baseUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: publishedIso,
      modifiedTime: updatedIso,
      images,
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

const BlogPost = async ({ params }) => {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const description = buildDescription(post);
  const publishedIso = toIsoDate(post.publishedAt || post.date);
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    author: {
      "@type": "Organization",
      name: "Melemi Bojana",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Melemi Bojana",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
  };

  if (post.coverImage) {
    blogSchema.image = [post.coverImage];
  }

  if (publishedIso) {
    blogSchema.datePublished = publishedIso;
    blogSchema.dateModified = publishedIso;
  }

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
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
            <Image
              src={post.coverImage}
              alt={post.title}
              width={768}
              height={360}
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
