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
    <article class={tw`w-full font-sans`}>
      <h1 class={tw`text-2xl my-8 mt-10`}>{props.title}</h1>
      <div class={tw`text-right text-gray-500`}>2022-07-10 日</div>
      <section dangerouslySetInnerHTML={{ __html: props.contentHtml }} />
    </article>
  );
}
