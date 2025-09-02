import React, { useEffect, useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";

// ✅ PDF.js worker
GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const PDFPreview = ({ url }) => {
  const [canvasUrl, setCanvasUrl] = useState(null);

  useEffect(() => {
    let renderTask = null;
    let cancelled = false;

    const renderPDF = async () => {
      try {
        const pdf = await getDocument(url).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        // ✅ create an offscreen canvas each render
        const offscreen = document.createElement("canvas");
        const context = offscreen.getContext("2d");
        offscreen.width = viewport.width;
        offscreen.height = viewport.height;

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;

        if (!cancelled) {
          // ✅ store as image so React <img> displays it
          setCanvasUrl(offscreen.toDataURL());
        }
      } catch (error) {
        if (error?.name !== "RenderingCancelledException") {
          console.error("❌ PDF render error:", error);
        }
      }
    };

    renderPDF();

    return () => {
      cancelled = true;
      if (renderTask) renderTask.cancel();
    };
  }, [url]);

  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-gray-100 p-4">
      {canvasUrl ? (
        <img src={canvasUrl} alt="PDF Preview" className="w-full h-auto" />
      ) : (
        <p className="text-gray-500 text-center">Loading PDF...</p>
      )}
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
