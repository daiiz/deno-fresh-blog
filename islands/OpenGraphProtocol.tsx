/** @jsx h */
import { h } from "preact";
import { parseLinkLikeBracketing } from "@islands-lib/bracketing.ts";

type Props = {
  title: string;
  text: string;
};

export default function OpenGraphProtocol({ title, text }: Props) {
  const eTitle = encodeURIComponent(title);
  const url = `https://daiizblog.deno.dev/docs/htext/${eTitle}`;
  const bracketings = text.match(/\[([^\[\]]+)\]/g) || [];
  let imageUrl = "";
  for (const bracketing of bracketings) {
    const res = parseLinkLikeBracketing(bracketing);
    if (res.imageUrl) {
      imageUrl = res.thumbnailUrl || res.imageUrl;
      break;
    }
  }
  return (
    <div class="ogp">
      <meta name="twitter:card" content="summary" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : ""}
    </div>
  );
}
