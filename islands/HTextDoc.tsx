/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

const preStyle = {
  margin: "1em auto",
  wordWrap: "break-word",
  whiteSpace: "pre-wrap",
  fontSize: "14px",
  tabSize: 40, // 64
  // color: "#4a4a4a",
  width: "calc(100% - 132px)",
  maxWidth: "960px",
  minWidth: "600px",
};

const lineStyle = {
  minHeight: "1.1em",
  fontFamily: '"Roboto",Helvetica,Arial,"Hiragino Sans",sans-serif',
};

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
  return <div style={lineStyle}>{chars}</div>;
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
