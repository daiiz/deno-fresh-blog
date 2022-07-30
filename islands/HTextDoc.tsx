/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

const preStyle = {
  margin: "1em 0px",
  wordWrap: "break-word",
  whiteSpace: "pre-wrap",
  fontSize: "13px",
  tabSize: 40, // 64
};

const lineStyle = {
  minHeight: "1.1em",
  fontFamily: '"Roboto",Helvetica,Arial,"Hiragino Sans",sans-serif',
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
  return <div style={lineStyle}>{renderingText}</div>;
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
      <div style={preStyle}>{lineElems}</div>
    </div>
  );
}
