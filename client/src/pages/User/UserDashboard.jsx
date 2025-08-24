import React, { useEffect, useState } from "react";
import api from "../../axios/index";
import { Link, useNavigate } from "react-router-dom";
import { onTicketUpdate, offTicketUpdate } from "../../utils/socket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      console.error(err);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ Listen for updates
    const handleUpdate = ({ ticketId, status }) => {
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId ? { ...t, status } : t))
      );

      // 🔔 Show toast notification
      toast.info(`Ticket ${ticketId} is now ${status}   userside`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    };

    onTicketUpdate(handleUpdate);

    // Fetch tickets initially
    fetchTickets();

    // Cleanup on unmount
    return () => {
      offTicketUpdate(handleUpdate);
    };
  }, []);

  const navigate = useNavigate();

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      {/* Toast container */}
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Issues</h1>

        <Link to="/user/create-ticket">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg shadow">
            + Log Issue
          </button>
        </Link>
      </div>

      {tickets.length === 0 ? (
        <p className="text-gray-500 italic">No tickets found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="p-5 border rounded-xl bg-white shadow hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-gray-800">
                  {ticket.title}
                </h2>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    ticket.status === "open"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              {/* Body */}
              <p className="text-gray-600 mt-2 line-clamp-2">
                {ticket.description}
              </p>

              <div className="mt-3 text-sm text-gray-500">
                <span className="font-medium">Category:</span> {ticket.category}
              </div>

              {/* Footer */}
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 transition text-white rounded-lg text-sm shadow"
                  onClick={() => navigate(`/user/suggestion/${ticket._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
