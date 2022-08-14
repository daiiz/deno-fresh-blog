// `[[文字]]`, `[* 文字]`, `[*** 文字]` の記法を解釈する
export const parseDecorationBold = (chars: string) => {
  const parsed = [];
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (i === 0 && char === "[") {
      let skipCount = 0;
      if (chars[i + 1] === "[") {
        // 太字記法の開始
        skipCount = 1;
      } else if (chars[i + 1] === "*") {
        // 太字記法の開始
        skipCount = chars
          .slice(1)
          .join("")
          .match(/^[\*\s]+/)[0].length;
      }
      const subStr = chars.slice(i + skipCount + 1);
      console.log("skipCount", skipCount, subStr);
    }
  }

  console.log("chars", chars);
};
