// `[[文字]]`, `[* 文字]`, `[*** 文字]` の記法を解釈する
export const parseDecorationBold = (chars: string) => {
  const parsed = [];
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    if (char === "[") {
      if (chars[i + 1] === "[" && chars[i + 1] === "*") {
      }
    }
  }

  console.log("chars", chars);
};
