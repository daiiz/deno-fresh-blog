/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import DailyArticleList from "../islands/DailyArticleList.tsx";

const HomeDescriptions = () => {
  return (
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
  );
};

export default function Home() {
  return (
    <div>
      <link rel="stylesheet" href="/css/global.css" />
      <title>だいず書庫</title>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <div class={tw`flex flex-col text-center`}>
          <h1 class={tw`text-2xl mt-10`}>だいず書庫</h1>
          <HomeDescriptions />
        </div>
        <div class="daily-container">
          <DailyArticleList />
        </div>
      </div>
    </div>
  );
}
