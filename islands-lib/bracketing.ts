const isGyazoUrl = (url: string): string => {
  return /^https?:\/\/gyazo\.com\/[0-9a-f]{32}(\/raw)?$/.test(url);
};

const isImageUrl = (url: string): string => {
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

export const parseIconTitle = (text) => {
  if (text.endsWith(".icon")) {
    return [true, text.slice(0, -5), 1];
  }
  const iconTowerPattern = /\.icon\*\d+$/;
  if (iconTowerPattern.test(text)) {
    const iconSize = text.match(/\.icon\*(\d+)$/)[1];
    return [true, text.replace(iconTowerPattern, ""), +iconSize];
  }
  return [false, "", 0];
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
        imageUrl = tok.replace(/\/raw$/, "");
        thumbnailUrl = getGyazoThumbnailUrl(`[${tok}]`);
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
