import React, { useEffect, useState } from "react";
import PDFPreview from "./components/PDFPreview";

function App() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const imagekitPublicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${backendUrl}/files`);
      const data = await res.json();
      setImages(data);
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
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">📂 Upload & Preview Files</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center">
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

        <h2 className="text-xl font-semibold mb-4">🖼️ Preview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((file) =>
            file.name.toLowerCase().endsWith(".pdf") ? (
              <PDFPreview key={file.fileId} url={file.url} />
            ) : (
              <img
                key={file.fileId}
                src={file.url}
                alt={file.name}
                className="rounded-lg border shadow-md max-h-64 object-contain"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
