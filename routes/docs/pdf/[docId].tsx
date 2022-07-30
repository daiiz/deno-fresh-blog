/** @jsx h */
import "dotenv/load.ts";
import { h } from "preact";
import { tw } from "@twind";
import { findLatestArticle } from "@db";
import { PageProps } from "$fresh/server.ts";
import PdfDoc from "../../../islands/PdfDoc.tsx";

const bucketName = Deno.env.get("GCS_BUCKET_NAME");

export const handler = {
  async GET(_, ctx) {
    const { docId } = ctx.params;
    const docTitle = decodeURIComponent(docId);
    const article = await findLatestArticle(docTitle);
    const objectName = article ? article.gcsObjectName : "";
    return ctx.render(Object.assign({}, ctx.params, { objectName, docTitle }));
  },
};

export default function DocPage(props: PageProps) {
  const { docId, docTitle, objectName } = props.data;
  let pdfUrl = "";
  let title = "denoland/fresh";
  if (docId === "guibook") {
    title = "入門GUI";
    pdfUrl =
      "https://daiiz-paprika.appspot.com/doc/2348d6fd4c5f98e04208cc2374bff8b2";
  } else if (objectName) {
    title = docTitle;
    pdfUrl = `https://storage.googleapis.com/${bucketName}/${objectName}`;
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
      <div
        class={tw`flex flex-row px-2 pt-1 pb-2`}
        style={{ backgroundColor: "#f9f9fa", justifyContent: "space-between" }}
      >
        <div class={tw`text-sm`}>
          <a href="/" class={tw`text-blue-600`}>
            New notes
          </a>{" "}
          › {title}
        </div>
        <div class={tw`px-2 text-sm`}>
          <a
            href={`/docs/htext/${encodeURIComponent(title)}`}
            class={tw`text-blue-600`}
          >
            text
          </a>
          <span class={tw`text-gray-400`}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <a
            href={`/docs/json/${encodeURIComponent(title)}`}
            class={tw`text-blue-600`}
          >
            json
          </a>
        </div>
      </div>
      <div style={{ flexGrow: 1 }}>
        <PdfDoc contentUrl={url} />
      </div>
    </div>
  );
}
