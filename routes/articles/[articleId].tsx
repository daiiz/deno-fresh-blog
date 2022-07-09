/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { PageProps } from "$fresh/server.ts";
import Article from "../../islands/Article.tsx";

export default function Greet(props: PageProps) {
  const { articleId } = props.params;
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <Article
        title="My fresh だいず"
        contentHtml="1億年ぶりにブログを作っていくよ。"
      />
    </div>
  );
}
