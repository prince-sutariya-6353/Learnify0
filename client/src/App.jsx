import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// PDF.js worker config
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [pdfBlobs, setPdfBlobs] = useState({});

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const imagekitPublicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

  const fetchFiles = async () => {
    const res = await fetch(`${backendUrl}/files`);
    const data = await res.json();
    setFiles(data);

    // Convert PDF URLs to blobs
    data.forEach(async (file) => {
      if (file.mime.includes("pdf")) {
        const res = await fetch(file.url);
        const blob = await res.blob();
        setPdfBlobs((prev) => ({
          ...prev,
          [file.fileId]: blob,
        }));
      }
    });
  };

  const uploadFile = async () => {
    if (!file) return alert("Please select a file!");

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
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload File to 'Learnify' Folder</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>

      <h3>📁 Files in 'Learnify' Folder</h3>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {files.map((file) => (
          <div
            key={file.fileId}
            style={{
              width: 300,
              height: 320,
              margin: 10,
              border: "2px solid #ccc",
              borderRadius: 5,
              padding: 10,
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            {file.mime && file.mime.includes("pdf") ? (
              <>
                {pdfBlobs[file.fileId] ? (
                  <Document
                    file={pdfBlobs[file.fileId]}
                    onLoadError={(error) =>
                      console.error("PDF load error:", error)
                    }
                    loading={<p>Loading PDF preview…</p>}
                  >
                    <Page pageNumber={1} width={250} />
                  </Document>
                ) : (
                  <p>Loading preview...</p>
                )}
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "block", marginTop: 10 }}
                >
                  {file.name}
                </a>
              </>
            ) : (
              <img
                src={file.url}
                alt={file.name}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
