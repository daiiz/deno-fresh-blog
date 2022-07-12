/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

// https://mozilla.github.io/pdf.js/examples/
export default function PdfDocCanvas({ contentUrl }: { contentUrl: string }) {
  if (!IS_BROWSER) {
    return <div />;
  }
  // Loaded via <script> tag, create shortcut to access PDF.js exports.
  const pdfjsLib = window["pdfjs-dist/build/pdf"];
  // The workerSrc property shall be specified.
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "//mozilla.github.io/pdf.js/build/pdf.worker.js";
  // Asynchronous download of PDF
  const loadingTask = pdfjsLib.getDocument(contentUrl);
  loadingTask.promise.then(
    function (pdf: { getPage: Function }) {
      console.log("PDF loaded");

      // Fetch the first page
      const pageNumber = 1;
      pdf.getPage(pageNumber).then(function (page) {
        console.log("Page loaded");

        const scale = 1.5;
        const viewport = page.getViewport({ scale: scale });

        // Prepare canvas using PDF page dimensions
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        const renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
          console.log("Page rendered");
        });
      });
    },
    function (reason: string) {
      // PDF loading error
      console.error(reason);
    }
  );
  return (
    <div>
      <h2>demo</h2>
      <canvas id="canvas" />
    </div>
  );
}
