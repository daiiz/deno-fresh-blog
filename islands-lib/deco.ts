// `[[文字]]`, `[* 文字]`, `[*** 文字]` の記法を解釈する
export const extractDecorationBold = (chars: string) => {
  const boldToks = []; // 開始タグ,文字,終了タグの配列
  let boldText = "";
  const i = 0;
  const char = chars[i];
  if (char === "[") {
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
    // console.log("skipCount", skipCount, subStr.join(""));
    const openStr = chars.slice(0, i + skipCount + 1).join("");
    let bracketOpenCountInSubStr = 1;
    for (let j = 0; j < subStr.length; j++) {
      const subChar = subStr[j];
      if (subChar === "[") {
        bracketOpenCountInSubStr += 1;
      } else if (subChar === "]") {
        bracketOpenCountInSubStr -= 1;
        if (bracketOpenCountInSubStr === 0) {
          const closeStr = subStr[j + 1] === "]" ? "]]" : "]";
          boldToks.push(openStr);
          boldToks.push(subStr.slice(0, j).join(""));
          boldToks.push(closeStr);
          break;
        }
      }
    } // end of loop for subStr
  }
  return boldToks;
};
