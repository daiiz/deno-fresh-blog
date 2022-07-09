/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { PageProps } from "$fresh/server.ts";
import Article from "../../islands/Article.tsx";

const paragraphs = [
  "1億年ぶりに<a class='link' href='#'>ブログ</a>を作っていくよ。朝マックを食べるために早起きするのは果たして健康的と言えるのか。出町柳商店街の七夕祭りに来た。いいこと思いついたと同時に頭痛もやってきた。ここのところVS Codeがめっちゃメモリを食っている。",
  "2億年ぶりに<a class='link' href='#'>ブログ</a>を作っていくよ。",
  "<div class='imgs'><img src='https://gyazo.com/afce18ec154efb29963b525aa9beac2c/raw' /><img src='https://gyazo.com/afce18ec154efb29963b525aa9beac2c/raw' /></div>",
  "DenoのWebフレームワーク「Fresh」を使ってみるよ！",
];

export default function Greet(props: PageProps) {
  const { articleId } = props.params;
  return (
    <div data-article-id={articleId}>
      <header></header>
      <main class={tw`p-4 mx-auto max-w-screen-md`}>
        <Article title="My fresh だいず" paragraphs={paragraphs} />
      </main>
      <footer class={tw`flex justify-center text-xs text-gray-500 my-8`}>
        <p>Powerd by foo</p>
      </footer>
    </div>
  );
}
