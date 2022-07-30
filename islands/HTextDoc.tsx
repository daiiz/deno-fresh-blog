/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

const LineChar = ({ char }: { char: string }) => {
  return <span>{char}</span>;
};

const Line = ({ text }: { text: string }) => {
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
  return <div class="line">{chars}</div>;
};

export default function HTextDoc({ text }: { text: string }) {
  if (!IS_BROWSER) {
    return <div />;
  }
  const lines = text.split("\n");

  const lineElems = [];
  for (const [idx, line] of lines.entries()) {
    lineElems.push(<Line text={line} key={idx} />);
  }
  return (
    <div class="textdoc" style={{ padding: "0 8px" }}>
      <div class="pre">{lineElems}</div>
    </div>
  );
}
