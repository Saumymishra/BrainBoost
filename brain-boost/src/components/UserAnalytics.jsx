import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

// Custom Tooltip for LineChart
const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow border border-gray-200">
        <p className="font-semibold">{label}</p>
        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            className={`text-sm ${
              entry.dataKey === "Score" ? "text-purple-600" : "text-green-600"
            }`}
          >
            {entry.name}: {entry.value}
            {entry.dataKey === "Accuracy" ? "%" : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for BarChart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded shadow border border-gray-200">
        <p className="font-semibold">{label}</p>
        <p className="text-purple-600">Time Spent: {payload[0].value} s</p>
      </div>
    );
  }
  return null;
};

const UserAnalytics = ({ userId, token }) => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [activeLine, setActiveLine] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError("");
      try {
        const resHistory = await fetch(
          `http://localhost:5000/api/results/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dataHistory = await resHistory.json();
        if (!resHistory.ok) throw new Error(dataHistory.message || "Failed to load history");
        setHistory(dataHistory.results);

        const resSummary = await fetch(
          `http://localhost:5000/api/results/user/${userId}/summary`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const dataSummary = await resSummary.json();
        if (!resSummary.ok) throw new Error(dataSummary.message || "Failed to load summary");
        setSummary(dataSummary);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (userId && token) {
      fetchAnalytics();
    }
  }, [userId, token]);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!summary) return null;

  const scoreTrendData = history
    .map((attempt, idx) => ({
      name: `Attempt ${history.length - idx}`,
      Score: attempt.correctAnswers,
      Accuracy: attempt.accuracy,
      TimeSpent: attempt.timeSpent,
    }))
    .reverse();

  // Safe formatting helpers:
  const safeFixed = (num, digits = 1) => (typeof num === "number" ? num.toFixed(digits) : "0.0");
  const safeRound = (num) => (typeof num === "number" ? Math.round(num) : 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-8">
      <h2 className="text-2xl font-bold mb-6">Your Quiz Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-purple-100 p-4 rounded shadow">
          <h3 className="font-semibold mb-1">Total Attempts</h3>
          <p className="text-3xl font-bold">{summary.totalAttempts ?? 0}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <h3 className="font-semibold mb-1">Average Score</h3>
          <p className="text-3xl font-bold">{safeFixed(summary.averageScore)}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <h3 className="font-semibold mb-1">Average Accuracy (%)</h3>
          <p className="text-3xl font-bold">{safeFixed(summary.averageAccuracy)}%</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <h3 className="font-semibold mb-1">Average Time Spent (s)</h3>
          <p className="text-3xl font-bold">{safeRound(summary.averageTimeSpent)}</p>
        </div>
      </div>

      {/* Score & Accuracy Trend Line Chart */}
      <div>
        <h3 className="font-semibold mb-2">Score & Accuracy Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={scoreTrendData}
            margin={{ top: 5, right: 30, bottom: 5, left: 0 }}
            onMouseLeave={() => setActiveLine(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280", fontWeight: "600" }}
              tickLine={false}
              axisLine={{ stroke: "#a78bfa" }}
            />
            <YAxis
              tick={{ fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#a78bfa" }}
              domain={[0, "dataMax + 5"]}
            />
            <Tooltip content={<CustomLineTooltip />} />
            <Legend
              verticalAlign="top"
              wrapperStyle={{ fontWeight: "600", cursor: "pointer" }}
              onClick={(e) => {
                setActiveLine(e.dataKey === activeLine ? null : e.dataKey);
              }}
            />
            <Line
              type="monotone"
              dataKey="Score"
              stroke="#7c3aed"
              strokeWidth={activeLine === "Score" ? 4 : 2}
              activeDot={{ r: 8 }}
              dot={{ r: 4, strokeWidth: 2, stroke: "#7c3aed" }}
              animationDuration={800}
            />
            <Line
              type="monotone"
              dataKey="Accuracy"
              stroke="#22c55e"
              strokeWidth={activeLine === "Accuracy" ? 4 : 2}
              dot={{ r: 4, strokeWidth: 2, stroke: "#22c55e" }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Time Spent Bar Chart */}
      <div>
        <h3 className="font-semibold mb-2">Time Spent per Attempt (seconds)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={scoreTrendData}
            margin={{ top: 5, right: 30, bottom: 5, left: 0 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fill: "#6b7280", fontWeight: "600" }}
              tickLine={false}
              axisLine={{ stroke: "#a78bfa" }}
            />
            <YAxis
              tick={{ fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#a78bfa" }}
              domain={[0, "dataMax + 10"]}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar
              dataKey="TimeSpent"
              fill="url(#colorTimeSpent)"
              radius={[4, 4, 0, 0]}
              onClick={(data, index) =>
                alert(`Clicked on ${data.name}: ${data.TimeSpent} seconds`)
              }
              style={{ cursor: "pointer" }}
              animationDuration={800}
            />
            <defs>
              <linearGradient id="colorTimeSpent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.6} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserAnalytics;
