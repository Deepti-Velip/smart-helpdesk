import React, { useState } from "react";
import api from "../../axios/index";
import { useNavigate } from "react-router-dom";

export default function CreateTicket() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "other",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tickets", form);
      navigate("/user/dashboard");
    } catch (err) {
      console.log(err);
      setError("Failed to create ticket");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">Log Issue</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="border rounded-lg p-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="border rounded-lg p-2"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="billing">Billing</option>
          <option value="tech">Tech</option>
          <option value="shipping">Shipping</option>
          <option value="other">Other</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
