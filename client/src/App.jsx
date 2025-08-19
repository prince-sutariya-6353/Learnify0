import React, { useEffect, useState } from "react";

function App() {
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
