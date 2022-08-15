// `[[文字]]`, `[* 文字]`, `[*** 文字]` の記法を解釈する
export const extractDecorationBold = (chars: string) => {
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
    let bracketOpenCountInSubStr = 1;
    for (let j = 0; j < subStr.length; j++) {
      const subChar = subStr[j];
      if (subChar === "[") {
        bracketOpenCountInSubStr += 1;
      } else if (subChar === "]") {
        bracketOpenCountInSubStr -= 1;
        if (bracketOpenCountInSubStr === 0) {
          let sliceIndex = j;
          if (subStr[j + 1] === "]") {
            sliceIndex += 1;
          }
          boldText =
            chars.slice(0, i + skipCount + 1).join("") +
            subStr.slice(0, sliceIndex + 1).join("");
          break;
        }
      }
    } // end of loop for subStr
  }
  return boldText;
};
