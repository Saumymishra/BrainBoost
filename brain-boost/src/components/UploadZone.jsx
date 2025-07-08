import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

const UploadZone = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Upload successful');
        console.log(data);
      } else {
        alert(`❌ Upload failed: ${data.message}`);
      }
    } catch (err) {
      alert('❌ Error uploading file');
      console.error(err);
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
        isDragOver 
          ? 'border-purple-400 bg-purple-50' 
          : 'border-gray-300 hover:border-purple-300 hover:bg-gray-50'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragOver ? 'text-purple-500' : 'text-gray-400'}`} />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Notes</h3>
      <p className="text-gray-600 mb-4">Drag and drop your files here, or click to browse</p>

      <button
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        onClick={() => fileInputRef.current.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Choose Files'}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.txt,.docx"
      />

      <p className="text-xs text-gray-500 mt-2">Supports PDF, DOCX, TXT files</p>
    </div>
  );
};

export default UploadZone;
