/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { useEffect, useState } from "preact/hooks";

interface LiItemProps {
  title: string;
  url: string;
  date: string;
}

export const LiItem = ({ title, url, date }: LiItemProps) => {
  return (
    <li>
      <a href={url} class={tw`text-blue-500`}>
        {title || "Untitled"}
      </a>
    </li>
  );
};

export default function RecentArtices() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/articles");
      const data = await res.json();
      setArticles(data.articles);
    };
    fetchData();
  }, []);

  return (
    <ul>
      {articles.map((x) => {
        const url = `./docs/htext/${encodeURIComponent(x.title)}`;
        const date = new Date(x.publishedAt)
          .toLocaleString()
          .replace(/:\d+$/, "");
        return <LiItem title={x.title} url={url} date={date} />;
      })}
    </ul>
  );
}
