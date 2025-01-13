import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebaseConfig'; // Ensure this path points to your Firebase configuration

interface FileUploaderProps {
  onUploadComplete: (urls: string[]) => void; // Callback function to pass uploaded file URLs
}

const FileUploader: React.FunctionComponent<FileUploaderProps> = ({ onUploadComplete }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<string[]>([]); // To store image preview URLs

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      setError(null); // Clear any previous errors

      // Generate previews for image files
      const previews = files.map(file => {
        return file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
      });
      setFilePreviews(previews);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) {
      setError('Please select at least one file to upload.');
      return;
    }

    const urls: string[] = [];
    const progressArray: number[] = new Array(selectedFiles.length).fill(0);
    setUploadProgress(progressArray);

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const storageRef = ref(storage, `uploads/${file.name}-${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculate upload progress
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          progressArray[i] = progress;
          setUploadProgress([...progressArray]);
        },
        (uploadError) => {
          console.error('Upload error:', uploadError);
          setError(`Error uploading file: ${file.name}`);
        },
        async () => {
          // File upload completed, get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          urls.push(downloadURL);

          if (urls.length === selectedFiles.length) {
            onUploadComplete(urls); // Call the parent component's callback with URLs
            setSelectedFiles([]); // Reset selected files
            setUploadProgress([]); // Reset progress
            setFilePreviews([]); // Reset previews
          }
        }
      );
    }
  };

  return (
    <div className="file-uploader">
      <label htmlFor="fileInput" className="block mb-2 text-sm font-medium text-gray-700">
        Upload Files
      </label>
      <input
        id="fileInput"
        type="file"
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Preview images */}
      <div className="mt-4 flex flex-wrap">
        {filePreviews.map((preview, index) => (
          preview ? (
            <div key={index} className="mb-4 mr-4">
              <img
                src={preview}
                alt={`preview-${index}`}
                className="w-24 h-24 object-cover rounded-md"
              />
            </div>
          ) : null
        ))}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </div>

      <div className="mt-4">
        {selectedFiles.map((file, index) => (
          <div key={file.name} className="mb-2">
            <p className="text-sm">{file.name}</p>
            <progress value={uploadProgress[index]} max="100" className="w-full"></progress>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
