/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

const isGyazoBraketing = (text: string): boolean => {
  return /^\[https?:\/\/gyazo\.com\/[0-9a-f]{32}\]$/.test(text);
};

const getGyazoThumbnailUrl = (bracketingText: string): string => {
  const gyazoId = bracketingText.replace(
    /^\[https?:\/\/gyazo\.com\/([0-9a-f]{32})\]$/,
    "$1"
  );
  return `https://gyazo.com/${gyazoId}/max_size/1000`;
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
        // console.log("...", subStr, srcUrl);
        charElems.push(
          <div class="image-container">
            <img loading="lazy" class="image" src={srcUrl} />
            <div class="image-notation">
              {subStr}
              <wbr />
            </div>
          </div>
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
        {tabCharElems.length ? <div class="indent">{tabCharElems}</div> : ""}
        <div class={contentClassNames.join(" ")} style={contentStyle}>
          {charElems.length > 0 ? charElems : <br />}
        </div>
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
