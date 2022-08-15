/** @jsx h */
import { h, Fragment } from "preact";
import { useEffect } from "preact/hooks";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import {
  isGyazoBraketing,
  getGyazoThumbnailUrl,
  parseLinkLikeBracketing,
} from "@islands-lib/bracketing.ts";
import { extractDecorationBold } from "../islands-lib/deco.ts";
import {
  LineProps,
  LineCharProps,
  LineLinkProps,
  LineScrapboxPageLinkProps,
  ScrapboxLineContentProps,
} from "@islands-lib/types.ts";

let iframeTimer = null;

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
  previewAreaId,
}: LineScrapboxPageLinkProps) => {
  if (!projectName || !title) {
    return title;
  }

  if (isIcon) {
    return <LineScrapboxPageIcon projectName={projectName} title={title} />;
  }

  const encodedTitle = encodeURIComponent(title);
  const scrapboxUrl = `https://scrapbox.io/${projectName}/${encodedTitle}`;

  const detachIframes = (keepFrame) => {
    const iframes = document.querySelectorAll(`.preview-area iframe`);
    for (const iframe of iframes) {
      if (iframe !== keepFrame) {
        clearInterval(iframeTimer);
        iframe.remove();
      }
    }
  };

  const inactiveCurrentFrameLinks = (onlyNotFoundFrames = false) => {
    const selector = ".active-frame, .not-found-frame";
    const activeLinkElems = document.querySelectorAll(selector);
    for (const activeLinkElem of activeLinkElems) {
      if (!onlyNotFoundFrames) {
        activeLinkElem.classList.remove("active-frame");
      }
      activeLinkElem.classList.remove("not-found-frame");
    }
  };

  const detectCurrentIframe = () => {
    let currentTitle = "";
    const activeLinkElem = document.querySelector(".active-frame");
    if (activeLinkElem) {
      currentTitle = activeLinkElem.innerText;
    }
    return currentTitle;
  };

  const onClick = async (e: MouseEvent) => {
    if (!e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      console.log("previewAreaId:", previewAreaId);
      // 仮実装
      const aElem = e.target;
      const previewArea = document.getElementById(previewAreaId);
      const prevTitle = detectCurrentIframe();
      if (!previewArea) {
        return;
      }
      if (prevTitle !== title) {
        const eTitle = encodeURIComponent(title);
        const url = `/docs/htext/${eTitle}?project=${projectName}&mode=frame`;
        const iframe = document.createElement("iframe");
        iframe.dataset.title = title;
        iframe.src = url;
        iframe.onload = () => {
          if (iframe.contentWindow.document.title) {
            detachIframes(iframe);
            inactiveCurrentFrameLinks();
            aElem.classList.add("active-frame");
            iframe.style.display = "block";
          } else {
            // Error
            inactiveCurrentFrameLinks(true);
            aElem.classList.remove("active-frame");
            aElem.classList.add("not-found-frame");
          }
          clearInterval(iframeTimer);
          iframeTimer = setInterval(() => {
            // console.log("frame:", title);
            const h = 2 + iframe.contentWindow.document.body.scrollHeight;
            iframe.style.height = `${h}px`;
          }, 200);
        };
        previewArea.appendChild(iframe);
      } else {
        // 開閉のトグル機能
        detachIframes();
        inactiveCurrentFrameLinks();
      }
      return;
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

export const Line = ({
  text,
  isTitle,
  isJsonView,
  projectName,
  previewAreaId,
}: LineProps) => {
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
    if (char === "[") {
      const subStr = chars.slice(idx).join("").split("]")[0] + "]";
      // 太文字の対応
      if (chars[idx + 1] === "[" || chars[idx + 1] === "*") {
        const boldStr = extractDecorationBold(chars.slice(idx));
        console.log("!##", boldStr);
        // console.log("##", chars);
        // idx += subStr.length - 1;
        // continue;
      }
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
              previewAreaId={previewAreaId}
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
  const TabChars = () => {
    return tabCharElems.length ? (
      <span class="indent">{tabCharElems}</span>
    ) : (
      ""
    );
  };
  return (
    <Fragment>
      <div class="line-wrap">
        <div class={classNames.join(" ")}>
          <TabChars />
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
      <div>
        <div className="preview-area" id={previewAreaId} style={contentStyle} />
      </div>
    </Fragment>
  );
};

export default function HTextDoc({
  projectName,
  text,
  mode,
}: {
  projectName: string;
  text: string;
  mode: "frame" | "";
}) {
  if (!IS_BROWSER) {
    return <div />;
  }

  // Helpfeel記法は索引的に利用したいので本文には表示しない
  const lines = text.split("\n").filter((x) => !x.trim().startsWith("? "));

  const lineElems = [];
  for (const [idx, line] of lines.entries()) {
    if (mode === "frame" && idx === 0) {
      continue;
    }
    const previewAreaId = `preview-${idx}`;
    lineElems.push(
      <Line
        text={line}
        key={idx}
        isTitle={idx === 0}
        isJsonView={false}
        projectName={projectName}
        previewAreaId={previewAreaId}
      />
    );
  }
  const style =
    mode === "frame" ? { padding: "4px 8px" } : { padding: "0 8px" };
  const preStyle = mode === "frame" ? { margin: "0 auto" } : {};
  return (
    <div class="textdoc" style={style}>
      <div class="pre" style={preStyle}>
        {lineElems}
      </div>
    </div>
  );
}
