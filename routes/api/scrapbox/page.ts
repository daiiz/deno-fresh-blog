const headers = {
  "Content-Type": "application/json",
};

export const handler = async (req: Request, _ctx: HandlerContext): Response => {
  const parsedUrl = new URL(req.url);
  const searchParams = new URLSearchParams(parsedUrl.search);
  // parse query
  const project = searchParams.get("project");
  const page = decodeURIComponent(searchParams.get("page"));
  // fetch scrapbox page text
  const url = `https://scrapbox.io/api/pages/${project}/${page}/text`;
  const res = await fetch(url);
  if (!res.ok) {
  }
  const text = await res.text();

  return new Response(JSON.stringify({ project, page, text }), {
    headers: { "Content-Type": "application/json" },
  });
};
