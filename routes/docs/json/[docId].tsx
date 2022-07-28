/** @jsx h */
import "dotenv/load.ts";
import { h } from "preact";
import { findLatestArticle } from "@db";
import { PageProps } from "$fresh/server.ts";
import JsonDoc from "../../../islands/JsonDoc.tsx";

const bucketName = Deno.env.get("GCS_BUCKET_NAME");

export const handler = {
  async GET(_, ctx) {
    // TODO: routes/docs/text/[docId].tsx と共通化する
    const docTitle = decodeURIComponent(ctx.params.docId);
    const article = await findLatestArticle(docTitle);
    const objectNameWithoutExt = article
      ? article.gcsObjectName.replace(/\.pdf$/, "")
      : "";
    let docText = "";
    const jsonUrl = `https://storage.googleapis.com/${bucketName}/${objectNameWithoutExt}.json`;
    const res = await fetch(jsonUrl, { method: "GET", redirect: "follow" });
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

export default function DocJsonPage(props: PageProps) {
  const { docId, docTitle, docText } = props.data;
  return (
    <div data-doc-id={docId}>
      <title>{docTitle}</title>
      <JsonDoc text={docText} />
    </div>
  );
}
