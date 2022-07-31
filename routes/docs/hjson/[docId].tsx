/** @jsx h */
import "dotenv/load.ts";
import { h } from "preact";
import { tw } from "@twind";
import { findLatestArticle } from "@db";
import { PageProps } from "$fresh/server.ts";
import OpenGraphProtocol from "../../../islands/OpenGraphProtocol.tsx";
import HJsonDoc from "../../../islands/HJsonDoc.tsx";

const bucketName = Deno.env.get("GCS_BUCKET_NAME");

export const handler = {
  async GET(_, ctx) {
    const docTitle = decodeURIComponent(ctx.params.docId);
    const article = await findLatestArticle(docTitle);
    const objectNameWithoutExt = article
      ? article.gcsObjectName.replace(/\.pdf$/, "")
      : "";
    let docJson = "";
    const jsonUrl = `https://storage.googleapis.com/${bucketName}/${objectNameWithoutExt}.json`;
    const res = await fetch(jsonUrl, { method: "GET", redirect: "follow" });
    if (res.ok) {
      docJson = await res.text();
    }
    return ctx.render(
      Object.assign({}, ctx.params, {
        docTitle,
        docJson,
      })
    );
  },
};

export default function DocJsonPage(props: PageProps) {
  const { docId, docTitle, docJson } = props.data;
  return (
    <div data-doc-id={docId}>
      <title>{docTitle}</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <OpenGraphProtocol title={docTitle} text={docJson} />
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
          › {docTitle}
        </div>
        <div class={tw`px-2 text-sm`}>
          <a
            href={`/docs/htext/${encodeURIComponent(docTitle)}`}
            class={tw`text-blue-600`}
          >
            text
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
      <HJsonDoc text={docJson} />
    </div>
  );
}
