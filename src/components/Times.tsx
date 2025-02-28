import { JSX, Index } from "solid-js";

export function times<T>(c: number, fn: (i: number) => T) {
  return new Array(c).fill(0).map((_, i) => fn(i));
}
export function Times(props: {
  count: number;
  children: (index: number) => JSX.Element;
}) {
  const list = () => new Array(props.count).fill(0);

  return <Index each={list()}>{(_, index) => props.children(index)}</Index>;
}
