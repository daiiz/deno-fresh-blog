/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { PageProps } from "$fresh/server.ts";
import Article from "../../islands/Article.tsx";

const paragraphs2 = ["そろそろ眠くなってきた。"];

const paragraphs1 = [
  "1億年ぶりに<a class='link' href='#'>ブログ</a>を作っていくよ。朝マックを食べるために早起きするのは果たして健康的と言えるのか。出町柳商店街の七夕祭りに来た。いいこと思いついたと同時に頭痛もやってきた。ここのところVS Codeがめっちゃメモリを食っている。",
  "2億年ぶりにブログを作っていくよ。",
  "<figure><div class='imgs'><img src='https://gyazo.com/afce18ec154efb29963b525aa9beac2c/max_size/1000' /><img src='https://gyazo.com/afce18ec154efb29963b525aa9beac2c/max_size/1000' /></div><figcaption>ダブル 抹茶 ティー ラテ ダブル</figcaption></figure>",
  "DenoのWebフレームワーク「Fresh」を使ってみているよ！<br />わりと理解しやすい。",
  "<ul><li>DenoのWebフレームワークFreshを体験する<ul><li>hello2</li></ul></li><li>Deno Freshプロジェクトの初期コードを読む</li><li>ブログを書く</li></ul>",
];

export default function Greet(props: PageProps) {
  const { articleId } = props.params;
  return (
    <div data-article-id={articleId}>
      <header></header>
      <main class={tw`p-4 mx-auto max-w-screen-md`}>
        <h1 class={tw`text-3xl my-8 mt-10`}>daiiz fresh blog</h1>
        <Article updates="2022-07-10 02:10" paragraphs={paragraphs2} />
        <Article updates="2022-07-09 23:00" paragraphs={paragraphs1} />
      </main>
      <footer class={tw`flex justify-center text-xs text-gray-500 my-8`}>
        <p>Powerd by foo</p>
      </footer>
    </div>
  );
}
