/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";

export default function Greet(props: PageProps) {
  const { articleId } = props.params;
  return <div>{articleId}</div>;
}
