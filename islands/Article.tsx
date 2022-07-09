/** @jsx h */
import { h } from "preact";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { tw } from "@twind";

interface ArticleProps {
  title: string;
  contentHtml: string;
}

export default function Article(props: ArticleProps) {
  return (
    <div class="article">
      <title>{props.title}</title>
      <article class={tw`w-full font-sans`}>
        <h1 class={tw`text-2xl my-8 mt-10`}>{props.title}</h1>
        <div class={tw`text-gray-500 mb-4`}>
          <table class={tw`flex justify-end text-sm`}>
            <tr>
              <td>
                <a href="../updates/2022/07/09">2022-07-09 23:00</a>
              </td>
              <td class={tw`pl-4`}>
                <a href="../authors/だいず">だいず</a>
              </td>
            </tr>
          </table>
        </div>
        <section
          class={tw`text-base leading-relaxed`}
          dangerouslySetInnerHTML={{ __html: props.contentHtml }}
        />
      </article>
    </div>
  );
}
