"use client";
import { useState, useEffect } from "react";
import api from "../axios/index"; // axios instance
import { useNavigate } from "react-router-dom";
export default function AdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch tickets
  useEffect(() => {
    api
      .get("/tickets")
      .then((res) => {
        setTickets(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tickets</h1>
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t._id} className="text-center">
              <td className="border p-2">{t.title}</td>
              <td className="border p-2">{t.status}</td>
              <td className="border p-2">{t.category}</td>
              <td className="border p-2 space-x-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() => navigate(`/ticket-details/${t._id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
