/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function JsonDoc({ text }: { text: string }) {
  if (!IS_BROWSER) {
    return <div />;
  }
  return (
    <div class="jsondoc" style={{ padding: "0 8px" }}>
      <pre
        style={{
          margin: "1em 0px",
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          fontSize: "13px",
          tabSize: 40, // 64
        }}
      >
        {text}
      </pre>
    </div>
  );
}
