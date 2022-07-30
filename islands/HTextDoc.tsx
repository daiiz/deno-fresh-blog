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
  imageUrl,
  isExternal,
}: {
  title: string;
  url: string;
  imageUrl: string;
  isExternal: boolean;
}) => {
  const className = isExternal ? "doc-link doc-link-underline" : "doc-link";

  const DocLinkRef = () => {
    const isScrapboxUrl = url.startsWith("https://scrapbox.io/");
    if (isScrapboxUrl || !title) {
      return <span></span>;
    }
    return <span class="doc-link-ref">{url}&nbsp;</span>;
  };

  return (
    <span class="doc-link-container">
      <DocLinkRef />
      <a href={url} class={className} target="_blank" rel="noopener noreferrer">
        {title || url || imageUrl}
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
        const linkLikeRes = parseLinkLikeBracketing(subStr);
        charElems.push(
          <span class="image-container">
            <img loading="lazy" class="image" src={srcUrl} />
            <span class="image-notation">
              <LineChar char="[" />
              <LineLink
                title={linkLikeRes.title}
                url={linkLikeRes.url}
                imageUrl={linkLikeRes.imageUrl}
                isExternal={false}
              />
              <LineChar char="]" />
            </span>
          </span>
        );
        idx += subStr.length - 1;
        continue;
      }

      // リンクっぽいブラケティングを解析する
      const linkLikeRes = parseLinkLikeBracketing(subStr);
      if (linkLikeRes.imageUrl) {
        const imageElem = (
          <span class="image-container">
            <img loading="lazy" class="image" src={linkLikeRes.imageUrl} />
            <span class="image-notation nopre">
              <LineChar char={subStr} />
            </span>
          </span>
        );
        if (linkLikeRes.url) {
          charElems.push(
            <a
              href={linkLikeRes.url}
              class="anchor-image-container"
              target="_blank"
              rel="noopener noreferrer"
            >
              {imageElem}
            </a>
          );
        } else {
          charElems.push(imageElem);
        }
        idx += subStr.length - 1;
        continue;
      }

      if (linkLikeRes.url) {
        charElems.push(<LineChar char="[" key={idx + "_["} />);
        charElems.push(
          <LineLink
            title={linkLikeRes.title}
            url={linkLikeRes.url}
            imageUrl={linkLikeRes.imageUrl}
            isExternal={true}
            key={idx + "_" + linkLikeRes.title}
          />
        );
        charElems.push(<LineChar char="]" key={idx + "_]"} />);
        idx += subStr.length - 1;
        continue;
      }
    }

    // 裸のURLの対応
    if (
      char === "h" &&
      chars[idx + 1] === "t" &&
      chars[idx + 2] === "t" &&
      chars[idx + 3] === "p"
    ) {
      const subStr = chars.slice(idx).join("").split(" ")[0];
      if (/^https?:\/\//.test(subStr)) {
        const key = idx + "_" + subStr;
        charElems.push(
          <LineLink
            title=""
            url={subStr}
            imageUrl=""
            isExternal={true}
            key={key}
          />
        );
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
