import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../axios/index";

export default function SuggestionPage() {
  const { id } = useParams(); // ticket id
  const [suggestion, setSuggestion] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestionAndArticles = async () => {
      try {
        // 1. Fetch suggestion for this ticket
        const { data: suggestionData } = await api.get(
          `agent/suggestions/${id}`
        );
        setSuggestion(suggestionData);

        // 2. If articleIds exist, fetch articles
        if (suggestionData.articleIds?.length) {
          const { data: articlesData } = await api.post("/kb/by-ids", {
            ids: suggestionData.articleIds,
          });
          setArticles(articlesData);
        }
      } catch (err) {
        console.error("Error fetching suggestion:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestionAndArticles();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <Link to="/user/dashboard" className="text-blue-600">
        ← Back
      </Link>

      <h1 className="text-2xl font-bold mb-4">AI Suggestion</h1>

      {suggestion ? (
        <div className="p-4 border rounded bg-gray-50 mb-4">
          <p>
            <strong>Category:</strong> {suggestion.predictedCategory}
          </p>
          <p>
            <strong>Reply:</strong> {suggestion.draftReply}
          </p>
        </div>
      ) : (
        <p>No suggestion found</p>
      )}

      <h2 className="text-xl font-semibold mb-2">Suggested Articles</h2>
      {articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((a) => (
            <div
              key={a._id}
              className="p-4 border rounded bg-white shadow-sm hover:shadow-md"
            >
              <h3 className="font-bold text-lg">{a.title}</h3>
              <p className="text-gray-700">{a.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No articles available.</p>
      )}
    </div>
  );
}
