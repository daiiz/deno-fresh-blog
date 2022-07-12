/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function PdfDoc({ contentUrl }: { contentUrl: string }) {
  if (!IS_BROWSER) {
    return <div />;
  }
  const iframeSrcUrl = `/pdfjs/web/viewer.html?file=${contentUrl}#zoom=100`;
  return (
    <div class="pdfdoc" style={{ width: "100%", height: "100%" }}>
      <iframe src={iframeSrcUrl} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
