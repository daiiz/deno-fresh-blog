export const getScrapboxProjectName = (objectName: string): string => {
  const toks = objectName.split("/");
  if (toks.length !== 3) {
    console.error("invalid object name", toks);
    return "";
  }
  return toks[0];
};
