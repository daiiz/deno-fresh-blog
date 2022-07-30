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

export default function HTextDoc({ text }: { text: string }) {
  if (!IS_BROWSER) {
    return <div />;
  }
  const lines = text.split("\n");
  return (
    <div class="textdoc" style={{ padding: "0 8px" }}>
      <pre style={preStyle}>{lines[0]}</pre>
    </div>
  );
}
