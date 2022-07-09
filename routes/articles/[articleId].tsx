/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { PageProps } from "$fresh/server.ts";
import Article from "../../islands/Article.tsx";

export default function Greet(props: PageProps) {
  const { articleId } = props.params;
  return (
    <div>
      <header></header>
      <main class={tw`p-4 mx-auto max-w-screen-md`}>
        <Article
          title="My fresh だいず"
          contentHtml="1億年ぶりにブログを作っていくよ。"
        />
      </main>
      <footer class={tw`flex justify-center text-xs text-gray-500 my-8`}>
        <p>Powerd by foo</p>
      </footer>
    </div>
  );
}
