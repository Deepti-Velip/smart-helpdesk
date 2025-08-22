import React, { useEffect, useState } from "react";
import api from "../../axios/index";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tickets for logged-in user
  const fetchTickets = async () => {
    try {
      const res = await api.get("/tickets/");
      setTickets(res.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Issues</h1>
        <Link to="/user/create-ticket">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Log Issue
          </button>
        </Link>
      </div>

      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md"
            >
              <h2 className="text-lg font-semibold">{ticket.title}</h2>
              <p className="text-gray-600">{ticket.description}</p>
              <p className="text-gray-600">{ticket.category}</p>
              <p className="text-sm mt-2">
                Status:{" "}
                <span
                  className={`font-medium ${
                    ticket.status === "open"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {ticket.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
