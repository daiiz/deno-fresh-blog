import { HandlerContext } from "$fresh/server.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  const u = new URL(_req.url);
  const url = u.searchParams.get("url");
  if (!url) {
    return new Response("Bad Request", { status: 400 });
  }
  const res = await fetch(url, { method: "GET" });
  if (!res.ok || res.headers.get("content-type") !== "application/pdf") {
    return new Response("Invalid file type", { status: 400 });
  }
  const blob = await res.blob();
  return new Response(blob, {
    headers: { "Content-Type": "application/pdf" },
  });
};
