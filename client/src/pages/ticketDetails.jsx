import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios/index"; // ✅ use api consistently

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [replyDialog, setReplyDialog] = useState(false);
  const [assignDialog, setAssignDialog] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [assignee, setAssignee] = useState("");
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [agents, setAgents] = useState([]);

  const [selectedTicket, setSelectedTicket] = useState(null);

  const statusOptions = [
    "open",
    "triaged",
    "waiting_human",
    "resolved",
    "closed",
  ];
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${id}`);
        setTicket(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching ticket:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAgents = async () => {
      try {
        const res = await api.get("auth/users?role=agent");
        setAgents(res.data);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };

    fetchAgents();
    fetchTicket();
  }, [id]);

  // Reply to ticket
  const handleReply = () => setReplyDialog(true);

  const submitReply = async () => {
    try {
      await api.post(`/tickets/${ticket._id}/reply`, { reply: replyText });
      setReplyDialog(false);
      setReplyText("");
      // reload
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data);
    } catch (err) {
      console.error("Error submitting reply:", err);
    }
  };

  // Assign ticket
  const handleAssign = () => setAssignDialog(true);

  const submitAssign = async () => {
    try {
      await api.post(`/tickets/${ticket._id}/assign`, { assignee });
      setAssignDialog(false);
      setAssignee("");
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data);
    } catch (err) {
      console.error("Error assigning ticket:", err);
    }
  };
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      setLoading(true);
      const res = await api.patch(`/tickets/${selectedTicket._id}/status`, {
        status: newStatus,
      });
      console.log(res);
      setStatusUpdateDialog(false);
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = (ticket) => {
    setSelectedTicket(ticket);
    setStatusUpdateDialog(true);
  };
  if (loading) return <div className="p-6">Loading ticket details...</div>;
  if (!ticket) return <div className="p-6 text-red-500">Ticket not found.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Ticket Details</h2>

      <p>
        <strong>Title:</strong> {ticket.title}
      </p>
      <p>
        <strong>Description:</strong> {ticket.description}
      </p>
      <p>
        <strong>Category:</strong> {ticket.category}
      </p>
      <p>
        <strong>Status:</strong> {ticket.status}
      </p>
      <p>
        <strong>Created By:</strong> {ticket.createdBy?.name} (
        {ticket.createdBy?.email})
      </p>
      <p>
        <strong>Assignee:</strong>{" "}
        {ticket.assignee
          ? `${ticket.assignee.name} (${ticket.assignee.email})`
          : "Unassigned"}
      </p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(ticket.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Updated At:</strong>{" "}
        {new Date(ticket.updatedAt).toLocaleString()}
      </p>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          className="px-3 py-1 bg-green-500 text-white rounded"
          onClick={handleReply}
        >
          Reply
        </button>
        <button
          className="px-3 py-1 bg-purple-500 text-white rounded"
          onClick={handleAssign}
        >
          Assign
        </button>
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded"
          onClick={() => handleStatusUpdate(ticket)}
        >
          Update Status
        </button>
        <button
          className="bg-cyan-500 text-white px-3 py-1 rounded"
          onClick={() => navigate(`/audit/${ticket._id}`)}
        >
          View Audit
        </button>
      </div>

      {/* Agent Suggestion */}
      {ticket.agentSuggestionId && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold text-lg mb-2">Agent Suggestion</h3>
          <p>
            <strong>Predicted Category:</strong>{" "}
            {ticket.agentSuggestionId.predictedCategory}
          </p>
          <p>
            <strong>Draft Reply:</strong> {ticket.agentSuggestionId.draftReply}
          </p>
          <p>
            <strong>Confidence:</strong>{" "}
            {(ticket.agentSuggestionId.confidence * 100).toFixed(1)}%
          </p>
          <p>
            <strong>Auto Closed:</strong>{" "}
            {ticket.agentSuggestionId.autoClosed ? "✅ Yes" : "❌ No"}
          </p>
          <div className="mt-2">
            <strong>Articles:</strong>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {ticket.agentSuggestionId.articles?.map((a) => (
                <li key={a._id}>
                  <span className="font-medium">{a.title}</span> –{" "}
                  {a.body.slice(0, 80)}...
                </li>
              )) || <li>None</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Back */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>

      {/* Reply Dialog */}
      {replyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <h2 className="text-xl font-bold mb-4">Reply to Ticket</h2>
            <textarea
              className="w-full border p-2 rounded mb-4"
              rows="4"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setReplyDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={submitReply}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Dialog */}
      {assignDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[400px]">
            <h2 className="text-xl font-bold mb-4">Assign Ticket</h2>
            <select
              className="w-full border p-2 rounded mb-4"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">-- Select Agent --</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name} ({agent.email})
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setAssignDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded"
                onClick={submitAssign}
                disabled={!assignee}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* update status Dialog */}
      {statusUpdateDialog && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <label className="font-medium">Status:</label>
            <select
              className="border rounded p-1"
              value={selectedTicket.status}
              onChange={handleStatusChange}
              disabled={loading}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => setStatusUpdateDialog(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
