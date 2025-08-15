import React, { useEffect, useState } from "react";

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

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload Image to "Learnify" Folder</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>

      <h3>📁 Images in 'Learnify' Folder</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {images.map((file) => (
          <img
            key={file.fileId}
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
        ))}
      </div>
    </div>
  );
}

export default App;
