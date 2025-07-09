import React, { useState, useEffect } from 'react';

const QuizPage = ({ noteId, token }) => {
  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({}); // key: question index, value: selected option index
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  // Fetch MCQs from backend by noteId
  useEffect(() => {
    async function fetchMCQs() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setMcqs(data.note.mcqs || []);
        } else {
          setSubmitMessage(`Error: ${data.message || 'Failed to load quiz'}`);
        }
      } catch (err) {
        setSubmitMessage('Error fetching quiz');
      } finally {
        setLoading(false);
      }
    }
    fetchMCQs();
  }, [noteId, token]);

  const handleOptionSelect = (qIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answers).length !== mcqs.length) {
      setSubmitMessage('Please answer all questions before submitting.');
      return;
    }

    let correctCount = 0;
    mcqs.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correctCount++;
    });
    setScore(correctCount);

    // Save results to backend (example endpoint)
    try {
      const res = await fetch(`http://localhost:5000/api/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          noteId,
          totalQuestions: mcqs.length,
          correctAnswers: correctCount,
          answers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitMessage(`Error saving results: ${data.message || ''}`);
      } else {
        setSubmitMessage('Results saved successfully!');
      }
    } catch {
      setSubmitMessage('Network error while saving results.');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading quiz...</p>;

  if (mcqs.length === 0) return <p className="text-center mt-10">No quiz available.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Quiz</h2>
      <form onSubmit={handleSubmit}>
        {mcqs.map((q, i) => (
          <div key={i} className="mb-6">
            <p className="font-medium mb-2">
              {i + 1}. {q.question}
            </p>
            <div className="space-y-1">
              {q.options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`block p-2 border rounded cursor-pointer ${
                    answers[i] === idx ? 'bg-purple-100 border-purple-500' : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${i}`}
                    value={idx}
                    checked={answers[i] === idx}
                    onChange={() => handleOptionSelect(i, idx)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
        >
          Submit
        </button>
      </form>

      {score !== null && (
        <p className="mt-4 font-semibold text-green-700">
          You scored {score} out of {mcqs.length}
        </p>
      )}

      {submitMessage && <p className="mt-2 text-red-600">{submitMessage}</p>}
    </div>
  );
};

export default QuizPage;
