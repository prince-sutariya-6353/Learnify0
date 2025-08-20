import React, { useEffect, useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
<<<<<<< HEAD

=======
>>>>>>> f63bde7 (first commit)
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
        fetchFiles();
      } else {
        alert("Upload failed.");
        console.error(data);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error.");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

<<<<<<< HEAD
  // Helper function to render files
  const renderFile = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
      return (
        <img
          src={file.url}
          alt={file.name}
          style={{
            maxHeight: 200,
            maxWidth: 300,
            margin: 10,
            border: "2px solid #ccc",
            borderRadius: 5,
          }}
        />
      );
    } else if (ext === "pdf") {
      return (
        <div style={{ margin: 10 }}>
          {/* PDF Preview */}
          <embed
            src={file.url}
            type="application/pdf"
            width="300"
            height="200"
            style={{
              border: "2px solid #ccc",
              borderRadius: 5,
              display: "block",
              marginBottom: 5,
            }}
          />
          {/* Download Link */}
          <a
            href={file.url}
            download={file.name}
            style={{
              textDecoration: "none",
              background: "#007bff",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            ⬇ Download PDF
          </a>
=======
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">📂 Upload & Preview Files</h1>
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
        <h2 className="text-xl font-semibold mb-6">🖼️ Preview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {files.map((file) => {
            const name = file.name.toLowerCase();
            if (name.endsWith(".pdf")) {
              return <PDFPreview key={file.fileId} url={file.url} />;
            }
            if (name.endsWith(".mp4")) {
              return (
                <div key={file.fileId} className="border rounded-lg shadow-md overflow-hidden bg-black">
                  <video
                    controls
                    className="w-full h-64 object-contain p-2"
                    src={file.url}
                  />
                  <p className="text-center py-2 text-sm text-gray-300 bg-gray-800 truncate">{file.name}</p>
                </div>
              );
            }
            return (
              <div key={file.fileId} className="border rounded-lg shadow-md overflow-hidden bg-white">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-64 object-contain p-2"
                />
                <p className="text-center py-2 text-sm text-gray-700 truncate">{file.name}</p>
              </div>
            );
          })}
>>>>>>> f63bde7 (first commit)
        </div>
      );
    } else {
      return (
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: 10 }}
        >
          📄 {file.name}
        </a>
      );
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload File to "Learnify" Folder</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>

      <h3>📁 Files in 'Learnify' Folder</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {files.map((file) => (
          <div key={file.fileId}>{renderFile(file)}</div>
        ))}
      </div>
    </div>
  );
}

export default App;