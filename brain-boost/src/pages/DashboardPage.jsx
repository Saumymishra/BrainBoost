import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import NoteCard from '../components/NoteCard';

const DashboardPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!token || !userEmail) {
      navigate('/login');
    }
  }, [token, userEmail, navigate]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', userEmail);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadedNotes((prev) => [...prev, data.file]);
        setMessage('✅ Upload successful!');
        setSelectedFile(null);
      } else {
        setMessage(`❌ Upload failed: ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ Error uploading file');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Notes</h1>
          <p className="text-gray-600">
            Upload new notes or review your existing quiz materials
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8 p-6 border rounded-lg bg-white shadow-sm">
          <form
            onSubmit={handleUpload}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="p-2 border rounded w-full sm:w-auto"
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
            >
              Upload Note
            </button>
          </form>
          {message && <p className="mt-4 text-purple-700">{message}</p>}
        </div>

        {/* Notes Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Notes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {uploadedNotes.length > 0 ? (
              uploadedNotes.map((note, index) => (
                <NoteCard
                  key={index}
                  title={note.fileName}
                  subject={note.fileType}
                  date={new Date(note.uploadDate).toLocaleDateString()}
                  questions={0} // Placeholder
                />
              ))
            ) : (
              <div className="text-center py-12 col-span-full">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes yet</h3>
                <p className="text-gray-600 mb-6">
                  Upload your first set of notes to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
