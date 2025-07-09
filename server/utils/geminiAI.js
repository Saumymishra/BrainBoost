import axios from 'axios';

export async function generateMCQsFromText(text) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

  const prompt = `
Generate exactly 5 multiple choice questions from the given text.
Each question should have exactly 4 options. Return only JSON, no markdown or explanation.

[
  {
    "question": "What is the capital of France?",
    "options": ["Berlin", "Paris", "Madrid", "Rome"],
    "correctIndex": 1
  }
]

Text:
"""${text}"""
`;

  try {
    const res = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const raw = res.data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const jsonStart = raw.indexOf('[');
    const jsonEnd = raw.lastIndexOf(']');
    const mcqString = raw.substring(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(mcqString);

    return parsed.map((mcq) => ({
      question: mcq.question,
      options: mcq.options,
      answerIndex: mcq.correctIndex, // ✅ convert key
    }));
  } catch (err) {
    console.error('Gemini API error:', err?.response?.data || err.message);
    return [];
  }
}
