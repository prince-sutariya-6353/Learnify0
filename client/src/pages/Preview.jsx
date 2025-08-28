import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PDFPreview from "../components/PDFPreview";

function Preview() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const imagekitPublicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${backendUrl}/files`);
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const uploadFile = async () => {
    if (!file) return alert("Please select a file!");
    try {
      const authRes = await fetch(`${backendUrl}/auth`);
      const auth = await authRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", imagekitPublicKey);
      formData.append("signature", auth.signature);
      formData.append("expire", auth.expire);
      formData.append("token", auth.token);
      formData.append("folder", "/Learnify");

      const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        alert("Upload successful!");
        setFile(null);
        fetchFiles();
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <Header />

        {/* Upload Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full sm:w-auto border rounded px-4 py-2"
          />
          <button
            onClick={uploadFile}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </div>

        {/* Preview Section */}
        <h2 className="text-xl font-semibold mb-6">🖼️ Preview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {files.map((file) => {
            const name = file.name.toLowerCase();

            if (name.endsWith(".pdf")) {
              return <PDFPreview key={file.fileId} url={file.url} />;
            }

            if (name.endsWith(".mp4")) {
              return (
                <div
                  key={file.fileId}
                  className="border rounded-lg shadow-md overflow-hidden bg-black"
                >
                  <video
                    controls
                    className="w-full h-64 object-contain p-2"
                    src={file.url}
                  />
                  <p className="text-center py-2 text-sm text-gray-300 bg-gray-800 truncate">
                    {file.name}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={file.fileId}
                className="border rounded-lg shadow-md overflow-hidden bg-white"
              >
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-64 object-contain p-2"
                />
                <p className="text-center py-2 text-sm text-gray-700 truncate">
                  {file.name}
                </p>
              </div>
            );
          })}   
        </div>
      </div>
    </div>
  );
}

export default Preview;
