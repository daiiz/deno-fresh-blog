/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import Article from "../../islands/Article.tsx";

export default function Greet(props: PageProps) {
  const { articleId } = props.params;
  return <Article title="Example" contentHtml="My fresh blog" />;
}
