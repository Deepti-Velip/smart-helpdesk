"use client";
import { useState } from "react";
import api from "../../axios/index";

export default function AddArticle() {
  const [form, setForm] = useState({
    title: "",
    body: "",
    tags: "",
    status: "draft",
  });

  const [articles, setArticles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/kb", {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()), // convert tags to array
      });
      setArticles((prev) => [...prev, res.data]); // update list
      setForm({ title: "", body: "", tags: "", status: "draft" });
    } catch (error) {
      console.error("Error adding article:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded space-y-3 shadow"
      >
        <h2 className="text-lg font-semibold">➕ Add New Article</h2>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Body"
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full p-2 border rounded"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Article
        </button>
      </form>

      {/* Preview added articles */}
      <div className="mt-6">
        <h3 className="text-lg font-medium">📄 Articles Added</h3>
        <ul className="space-y-2 mt-2">
          {articles.map((a, idx) => (
            <li key={idx} className="border p-2 rounded">
              <h4 className="font-semibold">{a.title}</h4>
              <p>{a.body}</p>
              <p className="text-sm text-gray-500">
                Tags: {a.tags?.join(", ")}
              </p>
              <span className="px-2 py-1 text-xs bg-gray-200 rounded">
                {a.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
