/** @jsx h */
import "dotenv/load.ts";
import { h } from "preact";
import { tw } from "@twind";
import { findLatestArticle } from "@db";
import { PageProps } from "$fresh/server.ts";
import HTextDoc from "../../../islands/HTextDoc.tsx";
import OpenGraphProtocol from "../../../islands/OpenGraphProtocol.tsx";

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
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <OpenGraphProtocol title={docTitle} text={docText} />
      <link rel="stylesheet" href="/css/global.css" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:400,500,600"
      />
      <div
        class={tw`flex flex-row px-2 pt-1 pb-2`}
        style={{
          backgroundColor: "#f9f9fa",
          justifyContent: "space-between",
          userSelect: "none",
        }}
      >
        <div class={tw`text-sm`}>
          <a href="/" class={tw`text-blue-600`}>
            New notes
          </a>{" "}
        </div>
        <div class={tw`px-2 text-sm`}>
          <span>text</span>
          <span class={tw`text-gray-400`}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <a
            href={`/docs/hjson/${encodeURIComponent(docTitle)}`}
            class={tw`text-blue-600`}
          >
            json
          </a>
          <span class={tw`text-gray-400`}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <a
            href={`/docs/pdf/${encodeURIComponent(docTitle)}`}
            class={tw`text-blue-600`}
          >
            pdf
          </a>
        </div>
      </div>
      <HTextDoc text={docText} />
    </div>
  );
}
