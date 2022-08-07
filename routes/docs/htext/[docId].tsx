/** @jsx h */
import "dotenv/load.ts";
import { h } from "preact";
import { tw } from "@twind";
import { findLatestArticle } from "@db";
import { PageProps } from "$fresh/server.ts";
import HTextDoc from "../../../islands/HTextDoc.tsx";
import OpenGraphProtocol from "../../../islands/OpenGraphProtocol.tsx";

const bucketName = Deno.env.get("GCS_BUCKET_NAME");

const getScrapboxProjectName = (objectName: string): string => {
  const toks = objectName.split("/");
  if (toks.length !== 3) {
    console.error("invalid object name");
    return "";
  }
  return toks[0];
};

export const handler = {
  async GET(_, ctx) {
    const docTitle = decodeURIComponent(ctx.params.docId);
    const article = await findLatestArticle(docTitle);
    const objectNameWithoutExt = article
      ? article.gcsObjectName.replace(/\.pdf$/, "")
      : "";
    let docText = "";
    const textUrl = `https://storage.googleapis.com/${bucketName}/${objectNameWithoutExt}.txt`;
    const projectName = getScrapboxProjectName(objectNameWithoutExt);
    const res = await fetch(textUrl, { method: "GET", redirect: "follow" });
    if (res.ok) {
      docText = await res.text();
    }
    return ctx.render(
      Object.assign({}, ctx.params, {
        projectName,
        docTitle,
        docText,
      })
    );
  },
};

export default function DocTextPage(props: PageProps) {
  const { projectName, docId, docTitle, docText } = props.data;
  const title = projectName ? `${docTitle} - ${projectName}` : docTitle;

  const Divider = () => {
    return <span class={tw`text-gray-400`}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>;
  };

  return (
    <div data-doc-id={docId}>
      <title>{title}</title>
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
          <a href="/" class="menu-link">
            Home
          </a>
        </div>
        <div class={tw`px-2 text-sm`}>
          <span>text</span>
          <Divider />
          <a
            href={`/docs/hjson/${encodeURIComponent(docTitle)}`}
            class="menu-link"
          >
            json
          </a>
          <Divider />
          <a
            href={`/docs/pdf/${encodeURIComponent(docTitle)}`}
            class="menu-link"
          >
            pdf
          </a>
        </div>
      </div>
      <HTextDoc text={docText} projectName={projectName} />
    </div>
  );
}
