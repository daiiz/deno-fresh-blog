/** @jsx h */
import "dotenv/load.ts";
import { h } from "preact";
import { tw } from "@twind";
import { PageProps } from "$fresh/server.ts";
import PdfDoc from "../../islands/PdfDoc.tsx";

const bucketName = Deno.env.get("GCS_BUCKET_NAME");

export default function DocPage(props: PageProps) {
  const { docId } = props.params;
  let pdfUrl = "";
  let title = "denoland/fresh";
  if (docId === "guibook") {
    title = "入門GUI";
    pdfUrl =
      "https://daiiz-paprika.appspot.com/doc/2348d6fd4c5f98e04208cc2374bff8b2";
  } else {
    title = decodeURIComponent(docId);
    const params = new URLSearchParams(props.url.search.replace(/^\?/, ""));
    const name = params.get("o");
    pdfUrl = `https://storage.googleapis.com/${bucketName}/${name}`;
  }
  let url = `/api/pdf?url=${pdfUrl}`;
  if (docId === "sample") {
    title = "pdf.jsに付属していたサンプル文書";
    url = "/pdfjs/web/compressed.tracemonkey-pldi-09.pdf";
  }
  return (
    <div data-doc-id={docId} class={tw`flex flex-col h-screen`}>
      <title>{title}</title>
      <script src="//mozilla.github.io/pdf.js/build/pdf.js"></script>
      <div class={tw`px-2 py-1 text-sm`} style={{ backgroundColor: "#f9f9fa" }}>
        <a href="/" class={tw`text-blue-600`}>
          New notes
        </a>{" "}
        › {title}
      </div>
      <div style={{ flexGrow: 1 }}>
        <PdfDoc contentUrl={url} />
      </div>
    </div>
  );
}
