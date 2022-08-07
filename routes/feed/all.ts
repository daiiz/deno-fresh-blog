import { HandlerContext } from "$fresh/server.ts";
import { Feed } from "https://jspm.dev/feed";

// 参考: https://github.com/daiiz/gyakky-js/blob/master/src/server/controllers/miil/index.js
export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const feed = new Feed({
    title: "daiizblog",
    description: "Recent updates on daiizblog",
    upteted: new Date(),
  });
  const feedItems = [];
  for (const item of feedItems) {
    feed.addItem(item);
  }
  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=UTF-8" },
  });
};
