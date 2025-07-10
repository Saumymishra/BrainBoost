import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const QuizPage = ({ token }) => {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [mcqs, setMcqs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [score, setScore] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Track quiz start time for timeSpent calculation
  const startTimeRef = useRef(null);

  useEffect(() => {
    async function fetchNoteAndGenerate() {
      try {
        setLoading(true);
        setGenerating(false);
        setSubmitMessage('');
        setScore(null);
        setAnswers({});
        startTimeRef.current = null;

        const res = await fetch(`http://localhost:5000/api/upload/${noteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch note');

        if (!data.note.mcqs || data.note.mcqs.length === 0) {
          setGenerating(true);

          const genRes = await fetch(`http://localhost:5000/api/upload/${noteId}/generate`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          });
          const genData = await genRes.json();
          if (!genRes.ok) throw new Error(genData.message || 'Quiz generation failed');

          setMcqs(genData.mcqs);
          setGenerating(false);
        } else {
          setMcqs(data.note.mcqs);
        }

        startTimeRef.current = Date.now(); // Start timer when quiz is ready
      } catch (err) {
        setSubmitMessage(`❌ ${err.message}`);
        setGenerating(false);
      } finally {
        setLoading(false);
      }
    }

    fetchNoteAndGenerate();
  }, [noteId, token]);

  const handleOptionSelect = (qIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
    setSubmitMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(answers).length !== mcqs.length) {
      setSubmitMessage('Please answer all questions before submitting.');
      return;
    }

    if (!startTimeRef.current) {
      setSubmitMessage('❌ Quiz timer error. Please reload the page.');
      return;
    }

    setSubmitting(true);
    setSubmitMessage('');

    const endTime = Date.now();
    const timeSpentSeconds = Math.floor((endTime - startTimeRef.current) / 1000);

    let correctCount = 0;
    mcqs.forEach((q, i) => {
      if (Number(answers[String(i)]) === q.answerIndex) correctCount++;
    });

    setScore(correctCount);

    try {
      const userEmail = localStorage.getItem('userEmail');

      const bodyPayload = {
        noteId,
        totalQuestions: mcqs.length,
        correctAnswers: correctCount,
        answers,
        userId: userEmail,
        timeSpent: timeSpentSeconds,
      };

      const res = await fetch(`http://localhost:5000/api/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitMessage(`Error saving results: ${data.message || ''}`);
      } else {
        setSubmitMessage('✅ Results saved successfully!');
      }
    } catch (err) {
      console.error('Network error while saving results:', err);
      setSubmitMessage('❌ Network error while saving results.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-3">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-purple-600 font-medium">Loading quiz...</p>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4 w-full max-w-2xl mx-auto px-4">
        <p className="text-purple-600 font-semibold text-lg">Generating quiz...</p>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="bg-purple-600 h-4 rounded-full animate-progress"
            style={{ width: '100%' }}
          />
        </div>
        <style>{`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-progress {
            animation: progress 2s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  if (mcqs.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-600">No quiz available for this note.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      {/* Back button and title */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        <h2 className="text-2xl font-semibold ml-6">Quiz</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {mcqs.map((q, i) => (
          <div key={i} className="mb-6">
            <p className="font-medium mb-2">{i + 1}. {q.question}</p>
            <div className="space-y-1">
              {q.options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`block p-2 border rounded cursor-pointer ${
                    answers[i] === idx ? 'bg-purple-100 border-purple-500' : 'border-gray-300'
                  } ${score !== null ? 'cursor-not-allowed opacity-60' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${i}`}
                    value={idx}
                    checked={answers[i] === idx}
                    onChange={() => handleOptionSelect(i, idx)}
                    className="mr-2"
                    disabled={score !== null}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={score !== null || submitting}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
        >
          Submit
        </button>
      </form>

      {score !== null && (
        <p className="mt-4 font-semibold text-green-700">
          ✅ You scored {score} out of {mcqs.length}
        </p>
      )}

      {submitMessage && (
        <p
          className={`mt-2 text-sm ${
            submitMessage.startsWith('✅')
              ? 'text-green-600'
              : submitMessage.startsWith('❌') || submitMessage.startsWith('Error')
              ? 'text-red-600'
              : 'text-gray-700'
          }`}
        >
          {submitMessage}
        </p>
      )}
    </div>
  );
};

export default QuizPage;
