'use-client';
// Import necessary modules
import React from 'react';

const FileUploader = ({ setSelectedFile }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!allowedTypes.includes(file.type)) {
      e.target.value = ''; // Reset the input
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  return (
    <div className='w-full'>
      <input
        id="file-upload"
        type="file"
        accept=".doc,.docx"
        className="file-input file-input-bordered w-full"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;
