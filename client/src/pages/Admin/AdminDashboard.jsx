import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios/index";

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Fetch articles

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      async function fetchArticles() {
        setLoading(true);
        setError("");

        try {
          let url = `/kb?query=${encodeURIComponent(search)}`;
          if (status) url += `&status=${status}`;

          const res = await axios.get(url);

          if (Array.isArray(res.data)) {
            setArticles(res.data);
          } else if (res.data.articles) {
            setArticles(res.data.articles);
          } else {
            setArticles([]);
          }
        } catch (err) {
          console.error("Error fetching articles:", err);
          setError("Failed to load articles");
          setArticles([]);
        } finally {
          setLoading(false);
        }
      }

      fetchArticles();
    }, 400); // debounce

    return () => clearTimeout(delayDebounce);
  }, [search, status]);

  // Delete article
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?"))
      return;
    try {
      await axios.delete(`/kb/${id}`);
      setArticles((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Error deleting article", err);
      alert("Failed to delete article");
    }
  };

  // Toggle status
  const handleToggleStatus = async (article) => {
    try {
      const updated = {
        ...article,
        status: article.status === "published" ? "unpublished" : "published",
      };
      const res = await axios.put(`/kb/${article._id}`, updated);
      setArticles((prev) =>
        prev.map((a) => (a._id === article._id ? res.data : a))
      );
    } catch (err) {
      console.error("Error updating status", err);
      alert("Failed to update status");
    }
  };

  // Save edit
  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `/kb/${selectedArticle._id}`,
        selectedArticle
      );
      setArticles((prev) =>
        prev.map((a) => (a._id === selectedArticle._id ? res.data : a))
      );
      setEditOpen(false);
    } catch (err) {
      console.error("Error editing article", err);
      alert("Failed to save changes");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      {/* Add Article */}
      <div className="p-4">
        <Link to="/admin/add-article">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Add Article
          </button>
        </Link>
      </div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search articles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full"
      />

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border px-3 py-2 rounded mb-4 w-full"
      >
        <option value="">All</option>
        <option value="published">Published</option>
        <option value="unpublished">Unpublish</option>
      </select>

      {/* Loading/Error */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {/* Articles Table */}
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Tags</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.length === 0 && !loading && (
            <tr>
              <td colSpan="3" className="text-center py-4">
                No articles found
              </td>
            </tr>
          )}
          {articles.map((article) => (
            <tr key={article._id}>
              <td className="border px-4 py-2">{article.title}</td>
              <td className="border px-4 py-2">
                <div className="flex gap-2 flex-wrap">
                  {article.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </td>

              <td className="border px-4 py-2">
                <div className="flex items-center justify-between">
                  <span>
                    {article.body.length > 100
                      ? article.body.substring(0, 100) + "..."
                      : article.body}
                  </span>
                  <button
                    className="ml-2 text-blue-600 underline text-sm"
                    onClick={() => {
                      setSelectedArticle(article);
                      setViewDialogOpen(true);
                    }}
                  >
                    View More
                  </button>
                </div>
              </td>

              <td className="border px-4 py-2 space-x-2">
                {/* Edit */}
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                  onClick={() => {
                    setSelectedArticle(article);
                    setEditOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleDelete(article._id)}
                >
                  Delete
                </button>

                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={() => handleToggleStatus(article)}
                >
                  {article.status === "published" ? "Unpublish" : "Publish"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Edit Dialog */}
      {editOpen && selectedArticle && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
          onClick={() => setEditOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Edit Article</h2>
            <input
              type="text"
              value={selectedArticle.title}
              onChange={(e) =>
                setSelectedArticle({
                  ...selectedArticle,
                  title: e.target.value,
                })
              }
              className="border w-full mb-3 px-3 py-2 rounded"
            />
            <textarea
              value={selectedArticle.body}
              onChange={(e) =>
                setSelectedArticle({
                  ...selectedArticle,
                  body: e.target.value,
                })
              }
              className="border w-full mb-3 px-3 py-2 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-3 py-1 bg-gray-500 text-white rounded"
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                onClick={handleSaveEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {viewDialogOpen && selectedArticle && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
          onClick={() => setViewDialogOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{selectedArticle.title}</h2>
            <p className="whitespace-pre-line">{selectedArticle.body}</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded"
                onClick={() => setViewDialogOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
