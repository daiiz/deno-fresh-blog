/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import {
  isGyazoBraketing,
  getGyazoThumbnailUrl,
  parseLinkLikeBracketing,
} from "@islands-lib/bracketing.ts";

const LineLink = ({
  title,
  url,
  isExternal,
}: {
  title: string;
  url: string;
  isExternal: boolean;
}) => {
  const className = isExternal ? "doc-link doc-link-underline" : "doc-link";
  const isScrapboxUrl = url.startsWith("https://scrapbox.io/");
  return (
    <span class="doc-link-container">
      {isScrapboxUrl ? "" : <span class="doc-link-ref">{url}&nbsp;</span>}
      <a href={url} class={className} target="_blank" rel="noopener noreferrer">
        {title}
      </a>
    </span>
  );
};

const LineChar = ({ char }: { char: string }) => {
  const classNames = ["char"];
  if (char === "[" || char === "]") {
    classNames.push("bracket");
  }
  if (char === ">") {
    classNames.push("quote");
  }
  return <span class={classNames.join(" ")}>{char}</span>;
};

const Line = ({ text, isTitle }: { text: string; isTitle: boolean }) => {
  const classNames = ["line"];
  const contentClassNames = ["content"];

  if (isTitle) {
    classNames.push("title");
  }
  let renderingText = text;
  // 行頭の空白文字をタブ文字に統一する
  const [, matched] = text.match(/^(\s+)/) || [];
  let spaceLen = 0;
  if (matched) {
    spaceLen = matched.length;
    const tabChars = "\t".repeat(spaceLen);
    renderingText = text.replace(/^\s*/, tabChars);
  }
  const chars = renderingText.split("");
  const tabCharElems = [];
  for (let idx = 0; idx < spaceLen; idx++) {
    tabCharElems.push(<span>{renderingText[idx]}</span>);
  }

  const charElems = [];
  if (chars[spaceLen] === ">") {
    contentClassNames.push("quote");
  }
  for (let idx = spaceLen; idx < chars.length; idx++) {
    const char = chars[idx];
    // ブラケティングされている箇所の対応
    if (char === "[" && chars[idx + 1] !== "[") {
      const subStr = chars.slice(idx).join("").split("]")[0] + "]";
      // Gyazo画像の埋め込み
      if (isGyazoBraketing(subStr)) {
        const srcUrl = getGyazoThumbnailUrl(subStr);
        charElems.push(
          <span class="image-container">
            <img loading="lazy" class="image" src={srcUrl} />
            <span class="image-notation">{subStr}</span>
          </span>
        );
        idx += subStr.length - 1;
        continue;
      }
      // リンクっぽいブラケティングを解析する
      const linkLikeRes = parseLinkLikeBracketing(subStr);
      if (linkLikeRes.url && linkLikeRes.title) {
        console.log(linkLikeRes);
        charElems.push(<LineChar char={"["} key={idx + "_["} />);
        charElems.push(
          <LineLink
            title={linkLikeRes.title}
            url={linkLikeRes.url}
            isExternal={true}
            key={idx + "_" + linkLikeRes.title}
          />
        );
        charElems.push(<LineChar char={"]"} key={idx + "_]"} />);
        idx += subStr.length - 1;
        continue;
      }
    }
    charElems.push(<LineChar char={char} key={idx} />);
  }

  const contentStyle = {
    marginLeft: `${spaceLen * 42}px`,
  };
  return (
    <div>
      <div class={classNames.join(" ")}>
        {tabCharElems.length ? <span class="indent">{tabCharElems}</span> : ""}
        <span class={contentClassNames.join(" ")} style={contentStyle}>
          {charElems.length > 0 ? charElems : <br />}
        </span>
      </div>
    </div>
  );
};

export default function HTextDoc({ text }: { text: string }) {
  if (!IS_BROWSER) {
    return <div />;
  }
  const lines = text.split("\n");

  const lineElems = [];
  for (const [idx, line] of lines.entries()) {
    lineElems.push(<Line text={line} key={idx} isTitle={idx === 0} />);
  }
  return (
    <div class="textdoc" style={{ padding: "0 8px" }}>
      <div class="pre">{lineElems}</div>
    </div>
  );
}
