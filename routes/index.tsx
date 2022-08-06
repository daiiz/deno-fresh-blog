/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import RecentArticles, { LiItem } from "../islands/RecentArticles.tsx";

export default function Home() {
  return (
    <div>
      <link rel="stylesheet" href="/css/global.css" />
      <title>だいず書庫</title>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <h1 class={tw`text-2xl mt-10`}>だいず書庫</h1>
        <div class={tw`text-sm text-gray-600 mb-8 mt-1`}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://scrapbox.io/daiiz/Pimento_Cloud"
          >
            Pimento Cloud
          </a>{" "}
          で作ったメモ置き場
        </div>
        <h2 class={tw`text-xl mb-4`}>New notes</h2>
        <RecentArticles />
        <ul>
          <LiItem title="入門GUI" url="./docs/guibook" date="2020/10/3 15:00" />
        </ul>
      </div>
    </div>
  );
}
