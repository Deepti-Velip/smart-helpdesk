import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios/index"; // your axios wrapper

export default function Audit() {
  const { id } = useParams(); // ticketId from route
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const res = await api.get(`/tickets/${id}/audit`);
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching audit logs", err);
      }
    };
    fetchAudit();
  }, [id]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Audit Trail for Ticket {id}</h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          Back
        </button>
      </div>

      {logs.length === 0 ? (
        <p>No audit logs found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">Actor</th>
              <th className="border px-3 py-2">Action</th>
              <th className="border px-3 py-2">Details</th>
              <th className="border px-3 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{log.actor}</td>
                <td className="border px-3 py-2">{log.action}</td>
                <td className="border px-3 py-2 text-sm text-gray-700 align-top">
                  <div className="bg-gray-50 p-2 rounded text-xs space-y-1">
                    {Object.entries(log.meta || {}).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-semibold">{key}:</span>{" "}
                        {typeof value === "object" ? (
                          <pre className="inline whitespace-pre-wrap">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        ) : (
                          <span>{String(value)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="border px-3 py-2">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
