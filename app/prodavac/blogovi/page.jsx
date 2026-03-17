"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("sr-Latn-BA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const SellerBlogList = () => {
  const { router, getToken, user } = useAppContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/blog/seller-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setPosts(data.posts || []);
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
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const deletePost = async (postId) => {
    const confirmed = window.confirm("Da li ste sigurni da želite obrisati blog?");
    if (!confirmed) return;
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/blog/delete",
        { postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setPosts((prev) => prev.filter((post) => post._id !== postId));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-lg font-medium">Blogovi</h2>
            <button
              onClick={() => router.push("/prodavac/blogovi/novi")}
              className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm"
            >
              Novi blog
            </button>
          </div>
          <div className="flex flex-col items-center max-w-5xl w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
            <table className="table-auto w-max min-w-full">
              <thead className="text-gray-900 text-sm text-left">
                <tr>
                  <th className="w-2/5 px-4 py-3 font-medium truncate">
                    Naslov
                  </th>
                  <th className="px-4 py-3 font-medium truncate">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium truncate">Datum</th>
                  <th className="px-4 py-3 font-medium truncate">Akcija</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {posts.map((post) => (
                  <tr key={post._id} className="border-t border-gray-500/20">
                    <td className="px-4 py-3 max-w-sm truncate">
                      {post.title}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium ${
                          post.isPublished ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {post.isPublished ? "Objavljeno" : "Nacrt"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {formatDate(post.publishedAt || post.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <button
                          onClick={() =>
                            router.push(`/prodavac/blogovi/uredi/${post._id}`)
                          }
                          className="px-2.5 md:px-3.5 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50"
                        >
                          Uredi
                        </button>
                        <button
                          onClick={() => {
                            if (!post.isPublished) return;
                            router.push(`/blog/${post.slug}`);
                          }}
                          className={`px-2.5 md:px-3.5 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 ${
                            post.isPublished
                              ? ""
                              : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          Pregled
                        </button>
                        <button
                          onClick={() => deletePost(post._id)}
                          className="px-2.5 md:px-3.5 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50"
                        >
                          Obriši
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerBlogList;
