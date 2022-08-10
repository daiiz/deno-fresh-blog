/** @jsx h */
import { h, Fragment } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import {
  isGyazoBraketing,
  getGyazoThumbnailUrl,
  parseLinkLikeBracketing,
} from "@islands-lib/bracketing.ts";

type LineProps = {
  text: string;
  projectName: string;
  isTitle?: boolean;
  isJsonView?: boolean;
};

type LineCharProps = {
  char: string;
  isJsonView?: boolean;
};

type LineLinkProps = {
  title: string;
  url: string;
  imageUrl: string;
  isExternal: boolean;
};

type ScrapboxLineContentProps = {
  projectName: string;
  docTitle: string;
  children: any;
  isTitle?: boolean;
};

const ScrapboxLineContent = ({
  projectName,
  docTitle,
  isTitle,
  children,
}: ScrapboxLineContentProps) => {
  if (!isTitle) {
    return children;
  }
  const encodedTitle = encodeURIComponent(docTitle);
  const scrapboxUrl = `https://scrapbox.io/${projectName}/${encodedTitle}`;
  return (
    <a
      href={scrapboxUrl}
      class="edit-link"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

const LineScrapboxPageIcon = ({
  projectName,
  title,
}: {
  projectName: string;
  title: string;
}) => {
  const [error, setError] = useState(false);
  const encodeTitle = encodeURIComponent(title);
  const iconUrl = `https://scrapbox.io/api/pages/${projectName}/${encodeTitle}/icon`;
  const iconNotationElems = [];
  for (const [idx, char] of `[${encodeTitle}.icon]`.split("").entries()) {
    iconNotationElems.push(
      <span key={idx} class="icon-notation-char">
        {char}
      </span>
    );
  }
  return (
    <Fragment>
      <span class="image-notation icon-notation">{iconNotationElems}</span>
      <span class="doc-icon-container">
        {!error ? (
          <img
            src={iconUrl}
            class="doc-scrapbox-icon"
            onError={() => {
              setError(true);
            }}
          />
        ) : (
          <span class="doc-scrapbox-icon-label">({encodeTitle})</span>
        )}
      </span>
    </Fragment>
  );
};

const LineScrapboxPageLink = ({
  projectName,
  title,
  isIcon,
}: {
  projectName: string;
  title: string;
  isIcon: boolean;
}) => {
  if (!projectName || !title) {
    return title;
  }

  if (isIcon) {
    return <LineScrapboxPageIcon projectName={projectName} title={title} />;
  }

  const encodedTitle = encodeURIComponent(title);
  const scrapboxUrl = `https://scrapbox.io/${projectName}/${encodedTitle}`;

  const onClick = (e: MouseEvent) => {
    if (!e.metaKey && !e.ctrlKey) {
      // e.preventDefault();
      // return;
    }
  };

  return (
    <span class="doc-link-container">
      <a
        onClick={onClick}
        href={scrapboxUrl}
        class="doc-scrapbox-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>
    </span>
  );
};

const LineLink = ({ title, url, imageUrl, isExternal }: LineLinkProps) => {
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
      <a
        href={imageUrl || url}
        class={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {title || url || imageUrl}
      </a>
    </span>
  );
};

const LineChar = ({ char, isJsonView }: LineCharProps) => {
  const classNames = ["char"];
  if (char === "[" || char === "]") {
    classNames.push("bracket");
  } else if (char === ">") {
    classNames.push("quote");
  } else if (char === "\\t") {
    classNames.push("tab");
  }

  // XXX: 雑
  if (isJsonView) {
    if (["[", "]", "{", "}", '"', ","].includes(char)) {
      classNames.push("json-mark");
    }
  }
  return <span class={classNames.join(" ")}>{char}</span>;
};

export const Line = ({ text, isTitle, isJsonView, projectName }: LineProps) => {
  const classNames = ["line"];
  const contentClassNames = ["content"];

  if (isTitle) {
    classNames.push("title");
  }
  let renderingText = text;
  // 行頭の空白文字をタブ文字に統一する
  const [, matched] = text.match(/^(\s+)/) || [];
  let spaceLen = 0;
  let tabChars = "";
  if (matched) {
    spaceLen = matched.length;
    tabChars = "\t".repeat(spaceLen);
    renderingText = text.replace(/^\s*/, tabChars);
  }
  // `""`で囲まれた文字列値の先頭の空白文字をタブ文字に統一する
  if (isJsonView) {
    const pattern = /^\"((:?\s|\\t)+)/;
    const tRenderingText = renderingText.trim();
    const [, matched] = tRenderingText.match(pattern) || [];
    if (matched) {
      const _matched = matched.replace(/\\t/g, " ");
      const tabStrs = "\\t".repeat(_matched.length);
      renderingText = tabChars + tRenderingText.replace(pattern, `"${tabStrs}`);
    }
  }
  const chars = renderingText.split("");
  const tabCharElems = [];
  for (let idx = 0; idx < spaceLen; idx++) {
    tabCharElems.push(<span>{renderingText[idx]}</span>);
  }

  const charElems = [];

  // 引用行の対応
  if (isJsonView) {
    const t = chars.join("").trim();
    if (/^"\\t*\>/.test(t)) {
      contentClassNames.push("quote");
    }
  } else if (chars[spaceLen] === ">") {
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
              <LineChar char="[" isJsonView={isJsonView} />
              <LineLink
                title={linkLikeRes.title}
                url={linkLikeRes.url}
                imageUrl={linkLikeRes.imageUrl}
                isExternal={false}
              />
              <LineChar char="]" isJsonView={isJsonView} />
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
            <img
              loading="lazy"
              class="image"
              src={linkLikeRes.thumbnailUrl || linkLikeRes.imageUrl}
            />
            <span class="image-notation nopre">
              <LineChar char={subStr} isJsonView={isJsonView} />
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
        charElems.push(
          <LineChar char="[" key={idx + "_["} isJsonView={isJsonView} />
        );
        charElems.push(
          <LineLink
            title={linkLikeRes.title}
            url={linkLikeRes.url}
            imageUrl={linkLikeRes.imageUrl}
            isExternal={true}
            key={idx + "_" + linkLikeRes.title}
          />
        );
        charElems.push(
          <LineChar char="]" key={idx + "_]"} isJsonView={isJsonView} />
        );
        idx += subStr.length - 1;
        continue;
      } else {
        if (projectName && linkLikeRes.title) {
          const isIcon = linkLikeRes.title.endsWith(".icon");
          const pageTitle = isIcon
            ? linkLikeRes.title.slice(0, -5)
            : linkLikeRes.title;
          // Scrapbox bracketing
          if (!isIcon) {
            charElems.push(
              <LineChar char="[" key={idx + "_["} isJsonView={isJsonView} />
            );
          }
          charElems.push(
            <LineScrapboxPageLink
              projectName={projectName}
              title={pageTitle}
              isIcon={isIcon}
              key={idx + "_" + linkLikeRes.title}
            />
          );
          if (!isIcon) {
            charElems.push(
              <LineChar char="]" key={idx + "_]"} isJsonView={isJsonView} />
            );
          }
          idx += subStr.length - 1;
          continue;
        }
      }
    }

    // 裸のURLの対応
    if (
      char === "h" &&
      chars[idx + 1] === "t" &&
      chars[idx + 2] === "t" &&
      chars[idx + 3] === "p"
    ) {
      const subStr = chars.slice(idx).join("").split(/[\s"]/)[0];
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

    // jsonViewモードでのタブ文字の対応
    if (isJsonView) {
      if (char === "\\" && chars[idx + 1] === "t") {
        charElems.push(
          <LineChar char="\t" isJsonView={isJsonView} key={idx + "_tab"} />
        );
        idx += 2 - 1;
        continue;
      }
    }

    charElems.push(<LineChar char={char} isJsonView={isJsonView} key={idx} />);
  }

  const spaceUnitPx = isJsonView ? 12 : 32;
  const contentStyle = {
    marginLeft: `${spaceLen * spaceUnitPx}px`,
  };
  return (
    <div class="line-wrap">
      <div class={classNames.join(" ")}>
        {tabCharElems.length ? <span class="indent">{tabCharElems}</span> : ""}
        <ScrapboxLineContent
          projectName={projectName}
          docTitle={text}
          isTitle={isTitle}
        >
          <span class={contentClassNames.join(" ")} style={contentStyle}>
            {charElems.length > 0 ? charElems : <br />}
          </span>
        </ScrapboxLineContent>
      </div>
    </div>
  );
};

export default function HTextDoc({
  projectName,
  text,
}: {
  projectName: string;
  text: string;
}) {
  if (!IS_BROWSER) {
    return <div />;
  }
  // Helpfeel記法は索引的に利用したいので本文には表示しない
  const lines = text.split("\n").filter((x) => !x.trim().startsWith("? "));

  const lineElems = [];
  for (const [idx, line] of lines.entries()) {
    lineElems.push(
      <Line
        text={line}
        key={idx}
        isTitle={idx === 0}
        isJsonView={false}
        projectName={projectName}
      />
    );
  }
  return (
    <div class="textdoc" style={{ padding: "0 8px" }}>
      <div class="pre">{lineElems}</div>
    </div>
  );
}
