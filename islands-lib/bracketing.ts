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
