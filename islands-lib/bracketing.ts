export const isGyazoBraketing = (text: string): boolean => {
  return /^\[https?:\/\/gyazo\.com\/[0-9a-f]{32}\]$/.test(text);
};

export const getGyazoThumbnailUrl = (bracketingText: string): string => {
  const gyazoId = bracketingText.replace(
    /^\[https?:\/\/gyazo\.com\/([0-9a-f]{32})\]$/,
    "$1"
  );
  return `https://gyazo.com/${gyazoId}/max_size/1000`;
};

export const parseLinkLikeBracketing = (bracketingText: string) => {
  const text = bracketingText.replace(/[\[\]]/g, "");
  if (text.startsWith("/")) {
    return {
      title: text,
      url: `https://scrapbox.io/${text.substring(1)}`,
    };
  }
  const toks = text.split(" ");
  const linkTextToks = [];
  let url = "";
  for (const tok of toks) {
    if (tok.startsWith("http://") || tok.startsWith("https://")) {
      url = tok;
    } else {
      linkTextToks.push(tok);
    }
  }
  return {
    title: linkTextToks.join(" "),
    url,
  };
};
