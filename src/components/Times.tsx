import { JSX, Index } from "solid-js";

export function Times(props: {
  count: number;
  children: (index: number) => JSX.Element;
}) {
  const list = () => new Array(props.count).fill(0);

  return <Index each={list()}>{(_, index) => props.children(index)}</Index>;
}
