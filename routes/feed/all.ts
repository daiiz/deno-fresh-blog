import { Feed } from "https://jspm.dev/feed";
import { HandlerContext } from "$fresh/server.ts";
import { findRecentArticles } from "@db";

// 参考: https://github.com/daiiz/gyakky-js/blob/master/src/server/controllers/miil/index.js
export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const feed = new Feed({
    title: "daiizblog",
    link: "https://daiizblog.deno.dev/",
    description: "Recent updates on daiizblog",
    upteted: new Date(),
  });

  // 全ての編集実績を得たいので、bookKeyが重複していてもそのまま返す
  const feedItems = [];
  const articles = await findRecentArticles();
  for (const article of articles) {
    console.log(article.bookKey, article);
    const encodedTitle = encodeURIComponent(article.title);
    const url = `https://daiizblog.deno.dev/docs/htext/${encodedTitle}`;
    const feedItem = {
      title: article.title,
      // `<a href="${srcUrl}"><img src="${srcUrl}" /></a>`,
      // TODO: 差分テキストを含めたい
      description: `<a href="${url}">${article.title}</a>`,
      date: new Date(article.publishedAt),
    };
    feedItems.push(feedItem);
  }

  for (const item of feedItems) {
    feed.addItem(item);
  }
  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=UTF-8" },
  });
};
