const isGyazoUrl = (url: string) => {
  return /^https?:\/\/gyazo\.com\/[0-9a-f]{32}(\/raw)?$/.test(url);
};

const isImageUrl = (url: string) => {
  return /^https?:\/\/.+\.(png|jpe?g|gif|svg|webp)$/.test(url);
};

export const isGyazoBraketing = (text: string): boolean => {
  const url = text.replace(/^\[/, "").replace(/\]$/, "");
  return isGyazoUrl(url);
};

export const getGyazoThumbnailUrl = (bracketingText: string): string => {
  const gyazoId = bracketingText.replace(
    /^\[https?:\/\/gyazo\.com\/([0-9a-f]{32})(:?\/raw)?\]$/,
    "$1"
  );
  return `https://gyazo.com/${gyazoId}/max_size/1000`;
};

export const parseLinkLikeBracketing = (bracketingText: string) => {
  const text = bracketingText.replace(/[\[\]]/g, "");
  if (text.startsWith("/")) {
    return {
      title: text,
      imageUrl: "",
      url: `https://scrapbox.io/${text.substring(1)}`,
    };
  }
  const toks = text.split(" ");
  const linkTextToks = [];
  let url = "";
  let imageUrl = "";
  let thumbnailUrl = "";
  for (const tok of toks) {
    if (tok.startsWith("http://") || tok.startsWith("https://")) {
      if (isImageUrl(tok)) {
        imageUrl = tok;
      } else if (isGyazoUrl(tok)) {
        imageUrl = tok;
        thumbnailUrl = getGyazoThumbnailUrl(tok);
      } else {
        url = tok;
      }
    } else {
      linkTextToks.push(tok);
    }
  }
  return {
    title: linkTextToks.join(" "),
    imageUrl,
    thumbnailUrl,
    url,
  };
};
