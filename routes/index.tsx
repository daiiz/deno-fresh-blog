/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

interface LiItemProps {
  title: string;
  url: string;
  date: string;
}

const LiItem = ({ title, url, date }: LiItemProps) => {
  return (
    <li>
      <a href={url} class={tw`text-blue-500`}>
        {title || "Untitled"}
      </a>
      <div class={tw`text-sm text-gray-800 inline-block ml-4`}>{date}</div>
    </li>
  );
};

export default function Home() {
  return (
    <div class={tw`p-4 mx-auto max-w-screen-md`}>
      <title>_φ(･_･</title>
      <h1 class={tw`text-2xl mt-10`}>_φ(･_･</h1>
      <div class={tw`text-sm text-gray-600 mb-8 mt-1`}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://scrapbox.io/daiiz/Pimento_Cloud"
        >
          Pimento Cloud
        </a>{" "}
        で作った資料置き場
      </div>
      <h2 class={tw`text-xl mb-4`}>New notes</h2>
      <ul>
        <LiItem
          title="denoland/fresh"
          url="./docs/deno-fresh"
          date="2022/7/10 16:01"
        />
        <LiItem
          title="denoland/fresh"
          url="./docs/deno-fresh"
          date="2022/7/9 11:01"
        />
        <LiItem title="入門GUI" url="./docs/guibook" date="2020/10/3 15:00" />
      </ul>
      <h2 class={tw`text-xl mb-4 mt-6`}>Sample notes</h2>
      <ul>
        <LiItem
          title="pdf.jsに付属していたサンプル文書"
          url="./docs/sample"
          date="2009/4/2 8:39"
        />
      </ul>
    </div>
  );
}
