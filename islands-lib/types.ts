export type LineProps = {
  text: string;
  projectName: string;
  previewAreaId: string;
  isTitle?: boolean;
  isJsonView?: boolean;
};

export type LineCharProps = {
  char: string;
  isJsonView?: boolean;
};

export type LineLinkProps = {
  title: string;
  url: string;
  imageUrl: string;
  isExternal: boolean;
};

export type LineScrapboxPageLinkProps = {
  projectName: string;
  title: string;
  isIcon: boolean;
  previewAreaId: string;
};

export type ScrapboxLineContentProps = {
  projectName: string;
  docTitle: string;
  children: any;
  isTitle?: boolean;
};