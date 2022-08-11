const headers = {
  "Content-Type": "text/plain; charset=utf-8",
};

export const handler = async (req: Request, _ctx: HandlerContext): Response => {
  const parsedUrl = new URL(req.url);
  // parse query
  const searchParams = new URLSearchParams(parsedUrl.search);
  const project = searchParams.get("project");
  const page = decodeURIComponent(searchParams.get("page"));
  // fetch scrapbox page text
  const url = `https://scrapbox.io/api/pages/${project}/${page}/text`;
  console.log("...url...", url);
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    return new Response("Bad Request:" + url, { status: 400 });
    // return new Response("", { headers });
  }
  const text = await res.text();
  return new Response(text, { headers });
};
