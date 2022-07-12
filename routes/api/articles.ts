import { HandlerContext } from "$fresh/server.ts";
import { findRecentArticles } from "../../utils/db.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  await findRecentArticles();
  return new Response("Hello World!");
};
