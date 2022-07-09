/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

interface ArticleProps {
  title: string;
  paragraphs: string[];
}

const articleStyle = [
  "article a.link { color: rgb(59 130 246); }",
  "article figure { margin: 24px 0; }",
  "article figure .imgs, figcaption { display: flex; justify-content: center; gap: 12px; }",
  "article figure figcaption { color: rgb(55 65 81); margin-top: 4px; }",
  "article .imgs img { max-height: 400px; max-width: 100%; border-radius: 2px; min-width: 0; opacity: 0.95; background: rgba(84, 80, 78, 0.05); }", // TODO: 縦長・横長で個別対応
].join("");

export default function Article(props: ArticleProps) {
  return (
    <div class="article">
      <title>{props.title}</title>
      <style dangerouslySetInnerHTML={{ __html: articleStyle }} />
      <article class={tw`w-full font-sans`}>
        <h1 class={tw`text-2xl my-8 mt-10`}>{props.title}</h1>
        {props.paragraphs.map((paragraph) => {
          return (
            <section
              class={tw`text-base leading-relaxed my-2`}
              dangerouslySetInnerHTML={{ __html: "<p>" + paragraph + "</p>" }}
            />
          );
        })}
      </article>
      <div class={tw`flex justify-end text-sm text-gray-500 mt-6`}>
        <table class={tw`font-mono`}>
          <tr>
            <td>
              <a href="../updates/2022/07/09">2022-07-10 02:10</a>
            </td>
            <td class={tw`pl-4`}>
              <img
                class={tw`inline-block align-sub mr-1`}
                src="https://gyazo.com/9a0da4f2757af9fe1cf7bd324237a968/raw"
                style={{ width: 18 }}
              />
              <a href="../authors/だいず">daiiz</a>
            </td>
          </tr>
          {/* <tr>
            <td>
              <a href="../updates/2022/07/09">2022-07-09 23:00</a>
            </td>
            <td class={tw`pl-4`}>
              <img
                class={tw`inline-block align-sub mr-1`}
                src="https://gyazo.com/9a0da4f2757af9fe1cf7bd324237a968/raw"
                style={{ width: 18 }}
              />
              <a href="../authors/Daiki%20Iizuka">Daiki Iizuka</a>
            </td>
          </tr> */}
        </table>
      </div>
    </div>
  );
}
