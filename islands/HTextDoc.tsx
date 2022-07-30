/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

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
  if (isTitle) {
    classNames.push("title");
  }
  let renderingText = text;
  // 行頭の空白文字をタブ文字に統一する
  const [, matched] = text.match(/^(\s+)/) || [];
  if (matched) {
    const spaceLen = matched.length;
    const tabChars = "\t".repeat(spaceLen);
    renderingText = text.replace(/^\s*/, tabChars);
  }
  const chars = [];
  for (const [idx, char] of renderingText.split("").entries()) {
    chars.push(<LineChar char={char} key={idx} />);
  }
  return <div class={classNames.join(" ")}>{chars}</div>;
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
