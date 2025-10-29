import { useState, useEffect } from "react";
import axios from "axios";
import { useSession, signIn, signOut } from "next-auth/react";
import EmailCard from "../components/EmailCard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState([]);
  const [classified, setClassified] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);

  // 🔐 Redirect to Google login if user is not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google"); // redirect to Google login
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && session) {
      const token = session?.user?.accessToken || session?.accessToken;
      if (token) {
        localStorage.setItem("google_access_token", token);
        console.log("✅ Google token stored in localStorage:", token.slice(0, 10));
      } else {
        console.warn("⚠️ No Google access token found in session.");
      }
    }
  }, [status, session]);

  if (status === "loading") return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );
  
  if (!session) return null; // Wait for session to load

  async function fetchEmails() {
    setLoading(true);
    const token = localStorage.getItem("google_access_token");
    if (!token) {
      alert("No Google access token found! Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`/api/gmail?accessToken=${token}`);
      localStorage.setItem("emails", JSON.stringify(res.data.emails));
      setEmails(res.data.emails);
    } catch (err) {
      console.error("Error fetching emails:", err);
      alert("Failed to fetch emails. Check console for details.");
    } finally {
      setLoading(false);
    }
  }

  async function classifyEmails() {
    setClassifying(true);
    const token = localStorage.getItem("google_access_token");
    if (!token) {
      alert("No Google access token found! Please log in again.");
      setClassifying(false);
      return;
    }

    const stored = JSON.parse(localStorage.getItem("emails"));
    if (!stored || stored.length === 0) {
      alert("No emails found! Please fetch emails first.");
      setClassifying(false);
      return;
    }

    try {
      const res = await axios.post("/api/classify", { emails: stored, apiKey });
      setClassified(res.data.categories);
    } catch (err) {
      console.error("Error classifying emails:", err);
      alert("Failed to classify emails. Check console for details.");
    } finally {
      setClassifying(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, {session?.user?.name}</h1>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              localStorage.removeItem("google_access_token");
              localStorage.removeItem("emails");
              setEmails([]);
              setClassified("");
              signOut({ callbackUrl: "/" });
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* API Key and Actions Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            placeholder="Enter your OpenAI API Key"
            className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={fetchEmails}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Fetching...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Fetch Emails</span>
              </>
            )}
          </button>

          <button
            onClick={classifyEmails}
            disabled={classifying || emails.length === 0 || !apiKey}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
          >
            {classifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Classifying...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Classify Emails</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Emails Grid */}
      {emails.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Your Emails ({emails.length})</h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {emails.length} found
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emails.map((email) => (
              <EmailCard key={email.id} subject={email.subject} />
            ))}
          </div>
        </div>
      )}

      {/* Classification Results */}
      {classified && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800">Classification Results</h2>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {classified}
            </pre>
          </div>
        </div>
      )}

      {/* Empty State */}
      {emails.length === 0 && !loading && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No emails yet</h3>
            <p className="text-gray-500 mb-6">
              Click the "Fetch Emails" button above to load your Gmail messages and get started with classification.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}