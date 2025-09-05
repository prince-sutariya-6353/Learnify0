import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import PDFPreview from "../components/PDFPreview";

function Preview() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [inputVersion, setInputVersion] = useState(0); // force-remount input
  const fileInputRef = useRef(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const imagekitPublicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${backendUrl}/files`);
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const resetFileInput = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    // in some browsers ref reset isn't enough — bump the key to remount input
    setInputVersion(v => v + 1);
  };

  const uploadFile = async (e) => {
    e?.preventDefault?.(); // in case this is inside a form
    if (!file || isUploading) return;

    try {
      setIsUploading(true);

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

      if (data?.url) {
        // optional: toast instead of alert to avoid blocking UI
        // but keeping alert as you had:
        alert("Upload successful!");
        resetFileInput();
        await fetchFiles(); // refresh grid
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error.");
    } finally {
      setIsUploading(false);
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
            key={inputVersion}           // force-remount when version changes
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full sm:w-auto border rounded px-4 py-2"
          />
          <button
            type="button"                // <- important: avoid form submit
            onClick={uploadFile}
            disabled={!file || isUploading}
            className={`px-6 py-2 rounded text-white ${
              isUploading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading ? "Uploading..." : "Upload"}
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
                <div key={file.fileId} className="border rounded-lg shadow-md overflow-hidden bg-black">
                  <video controls className="w-full h-64 object-contain p-2" src={file.url} />
                  <p className="text-center py-2 text-sm text-gray-300 bg-gray-800 truncate">
                    {file.name}
                  </p>
                </div>
              );
            }

            return (
              <div key={file.fileId} className="border rounded-lg shadow-md overflow-hidden bg-white">
                <img src={file.url} alt={file.name} className="w-full h-64 object-contain p-2" />
                <p className="text-center py-2 text-sm text-gray-700 truncate">{file.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Preview;
