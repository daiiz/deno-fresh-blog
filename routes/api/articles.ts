import { HandlerContext } from "$fresh/server.ts";
import { findRecentArticles } from "@db";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const articles = await findRecentArticles();
  const res: {
    articles: {
      key: string;
      title: string;
      name: string;
      publishedAt: number;
    }[];
  } = { articles: [] };

  // bookKeyが重複する場合は最新のものを返す
  const bookKeySet = new Set<string>();
  for (const a of articles) {
    const key = a.bookKey || `${a.projectName}/${a.bookId}`;
    if (bookKeySet.has(key)) {
      continue;
    }
    res.articles.push({
      key,
      title: a.title,
      name: a.gcsObjectName,
      publishedAt: a.publishedAt,
    });
    bookKeySet.add(key);
  }

  return new Response(JSON.stringify(res), {
    headers: { "Content-Type": "application/json" },
  });
};
