"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

const EditBlogPost = () => {
  const { id } = useParams();
  const { router, getToken, user } = useAppContext();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPost = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`/api/blog/id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        const post = data.post;
        setTitle(post.title || "");
        setSlug(post.slug || "");
        setExcerpt(post.excerpt || "");
        setCoverImage(post.coverImage || "");
        setContent(post.content || "");
        setIsPublished(post.isPublished === true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchPost();
    }
  }, [user, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/blog/update",
        { postId: id, title, slug, excerpt, coverImage, content, isPublished },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        router.push("/prodavac/blogovi");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Uredi blog</h2>
          <button
            type="button"
            onClick={() => router.push("/prodavac/blogovi")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Nazad
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="blog-title">
            Naslov
          </label>
          <input
            id="blog-title"
            type="text"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="blog-slug">
            Slug
          </label>
          <input
            id="blog-slug"
            type="text"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(event) => setSlug(event.target.value)}
            value={slug}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="blog-excerpt">
            Sažetak (opciono)
          </label>
          <textarea
            id="blog-excerpt"
            rows={3}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            onChange={(event) => setExcerpt(event.target.value)}
            value={excerpt}
          ></textarea>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="blog-cover">
            Cover slika (URL, opciono)
          </label>
          <input
            id="blog-cover"
            type="text"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(event) => setCoverImage(event.target.value)}
            value={coverImage}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="blog-content">
            Sadržaj (Markdown)
          </label>
          <textarea
            id="blog-content"
            rows={12}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            onChange={(event) => setContent(event.target.value)}
            value={content}
            required
          ></textarea>
          <p className="text-xs text-gray-500">HTML tagovi i inline stilovi nisu dozvoljeni.</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="publish-now"
            type="checkbox"
            className="h-4 w-4"
            checked={isPublished}
            onChange={(event) => setIsPublished(event.target.checked)}
          />
          <label className="text-sm text-gray-700" htmlFor="publish-now">
            Objavljeno
          </label>
        </div>

        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
          disabled={saving}
        >
          {saving ? "Sačuvavanje..." : "Sačuvaj"}
        </button>
      </form>
    </div>
  );
};

export default EditBlogPost;
