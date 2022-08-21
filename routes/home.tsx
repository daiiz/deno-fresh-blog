/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export default function Home() {
  return (
    <div>
      <link rel="stylesheet" href="/css/global.css" />
      <title>だいず書庫</title>
      <div class={tw`p-4 mx-auto max-w-screen-md`}>
        <div class={tw`flex justify-center`}>
          <h1 class={tw`text-2xl mt-10`}>だいず書庫</h1>
        </div>
      </div>
    </div>
  );
}
