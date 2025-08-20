import React, { useEffect, useRef } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const PDFPreview = ({ url }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderPDF = async () => {
      const pdf = await getDocument(url).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      page.render({ canvasContext: context, viewport });
    };
    renderPDF();
  }, [url]);

  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-gray-100 p-4">
      <canvas ref={canvasRef} className="w-full h-auto" />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center py-2 mt-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded"
      >
        View PDF
      </a>
    </div>
  );
};

export default PDFPreview;