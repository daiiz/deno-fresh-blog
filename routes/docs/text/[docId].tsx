/** @jsx h */
import "dotenv/load.ts";
import { h } from "preact";
import { findLatestArticle } from "@db";
import { PageProps } from "$fresh/server.ts";
import TextDoc from "../../../islands/TextDoc.tsx";

const bucketName = Deno.env.get("GCS_BUCKET_NAME");

export const handler = {
  async GET(_, ctx) {
    const docTitle = decodeURIComponent(ctx.params.docId);
    const article = await findLatestArticle(docTitle);
    const objectNameWithoutExt = article
      ? article.gcsObjectName.replace(/\.pdf$/, "")
      : "";
    let docText = "";
    const textUrl = `https://storage.googleapis.com/${bucketName}/${objectNameWithoutExt}.txt`;
    const res = await fetch(textUrl, { method: "GET", redirect: "follow" });
    if (res.ok) {
      docText = await res.text();
    }
    return ctx.render(
      Object.assign({}, ctx.params, {
        docTitle,
        docText,
      })
    );
  },
};

export default function DocTextPage(props: PageProps) {
  const { docId, docTitle, docText } = props.data;
  return (
    <div data-doc-id={docId}>
      <title>{docTitle}</title>
      <TextDoc text={docText} />
    </div>
  );
}
