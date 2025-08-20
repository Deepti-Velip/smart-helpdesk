import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <main className="flex flex-col md:flex-row flex-1 items-center justify-between px-8 py-16 max-w-6xl mx-auto">
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            AI-Powered Helpdesk <br /> with Smart Triage 🚀
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Raise support tickets and let our AI coworker classify, fetch
            knowledge-base articles, draft replies, and auto-resolve issues or
            assign them to the right human agent.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link
              to="/register"
              className="bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-gray-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/893/893292.png"
            alt="AI Helpdesk"
            className="w-72 md:w-96"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="px-8 py-16 bg-white">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Smart Helpdesk?
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="font-semibold text-lg mb-2">🤖 AI Triage</h4>
            <p className="text-gray-600">
              Automatically classify tickets by category and priority.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="font-semibold text-lg mb-2">📚 Knowledge-Base</h4>
            <p className="text-gray-600">
              Fetch relevant KB articles and draft smart replies instantly.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <h4 className="font-semibold text-lg mb-2">⚡ Faster Resolution</h4>
            <p className="text-gray-600">
              Auto-resolve simple tickets or route them to the right human
              agent.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-6 mt-auto text-gray-600">
        © {new Date().getFullYear()} Smart Helpdesk. All rights reserved.
      </footer>
    </div>
  );
}
