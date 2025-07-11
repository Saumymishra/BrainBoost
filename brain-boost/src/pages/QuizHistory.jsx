import React, { useEffect, useState } from 'react';

const QuizHistory = ({ userId, token }) => {
  const [results, setResults] = useState([]);
  const [notesMap, setNotesMap] = useState({});
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId || !token) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError('');

        const encodedUserId = encodeURIComponent(userId.trim()); // Clean up email/userId
        const res = await fetch(`http://localhost:5000/api/results/user/${encodedUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch results');
        }

        const data = await res.json();
        setResults(data.results || []);

        // Map results by noteId
        const map = {};
        data.results.forEach((r) => {
          const key = r.noteId?._id || r.noteId;
          if (!map[key]) map[key] = [];
          map[key].push(r);
        });

        setNotesMap(map);
      } catch (err) {
        console.error('❌ Error loading quiz history:', err);
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [userId, token]);

  if (loading) return <p>Loading quiz history...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (results.length === 0) return <p>No quiz attempts found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Quiz History by PDF</h2>

      {Object.keys(notesMap).map((noteId) => (
        <div key={noteId} className="mb-6 border rounded p-4 shadow">
          <button
            className="text-purple-700 font-semibold text-lg mb-2 hover:underline"
            onClick={() => setSelectedNoteId(selectedNoteId === noteId ? null : noteId)}
          >
            Note: {notesMap[noteId][0]?.noteId?.originalname || noteId} (
            {notesMap[noteId].length} attempt{notesMap[noteId].length > 1 ? 's' : ''})
          </button>

          {selectedNoteId === noteId && (
            <table className="w-full table-auto border-collapse border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1">Date</th>
                  <th className="border border-gray-300 px-2 py-1">Total Questions</th>
                  <th className="border border-gray-300 px-2 py-1">Correct</th>
                  <th className="border border-gray-300 px-2 py-1">Score (%)</th>
                  <th className="border border-gray-300 px-2 py-1">Time Spent (sec)</th>
                </tr>
              </thead>
              <tbody>
                {notesMap[noteId].map((attempt) => (
                  <tr key={attempt._id} className="text-center">
                    <td className="border border-gray-300 px-2 py-1">
                      {new Date(attempt.attemptedAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {attempt.totalQuestions}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {attempt.correctAnswers}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {attempt.accuracy?.toFixed(2) || '0'}
                    </td>
                    <td className="border border-gray-300 px-2 py-1">
                      {attempt.timeSpent || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuizHistory;
