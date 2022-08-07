/** @jsx h */
import { h } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Line } from "./HTextDoc.tsx";

export default function HJsonDoc({
  projectName,
  text,
}: {
  projectName: string;
  text: string;
}) {
  if (!IS_BROWSER) {
    return <div />;
  }

  const lines = text.split("\n");
  const lineElems = [];
  for (const [idx, line] of lines.entries()) {
    lineElems.push(
      <Line text={line} key={idx} isJsonView={true} projectName={projectName} />
    );
  }

  return (
    <div class="jsondoc" style={{ padding: "0 8px" }}>
      <div class="pre">{lineElems}</div>
    </div>
  );
}
