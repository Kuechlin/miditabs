import { css } from "@styles/css";
import { For, Index } from "solid-js";
import { useActions, useStore } from "~/store";

export function Grid() {
  const { moveTo } = useActions();
  const store = useStore();
  return (
    <div class={styles.grid}>
      <For each={store.notes}>
        {(note, x) => (
          <div class={styles.col} bool:data-selected={store.cursor.x === x()}>
            <Index each={store.strings}>
              {(_, y) => (
                <div
                  class={styles.cell}
                  classList={{
                    [styles.block]: x() % 8 === 0 || x() % 8 === 7,
                    [styles.block_start]: x() % 8 === 0,
                    [styles.block_end]: x() % 8 === 7,
                  }}
                  onClick={() => moveTo(x(), y)}
                  bool:data-selected={
                    store.cursor.y === y && store.cursor.x === x()
                  }
                >
                  <span>{note.notes[y] ?? ""}</span>
                </div>
              )}
            </Index>
          </div>
        )}
      </For>
    </div>
  );
}

const styles = {
  grid: css({
    display: "flex",
    width: "100%",
    flexWrap: "wrap",
  }),
  col: css({
    _selected: {
      bg: "neutral.800",
      borderRadius: "16px",
    },
  }),
  cell: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 8,
    height: 8,
    color: "white",
    outline: "none",
    position: "relative",
    cursor: "pointer",
    userSelect: "none",
    _before: {
      content: "' '",
      display: "block",
      position: "absolute",
      top: "calc(50% - 1px)",
      left: 0,
      right: 0,
      bg: "black",
      height: "2px",
      zIndex: 1,
    },
    _selected: {
      bg: "neutral.900",
      borderRadius: "50%",
      color: "blue.400",
    },
    "& span": {
      zIndex: 2,
    },
  }),
  mark: css({
    color: "white",
  }),
  block: css({
    breakAfter: "always",
    _after: {
      content: "' '",
      display: "flex",
      position: "absolute",
      bg: "black",
      top: 0,
      bottom: 0,
      width: "2px",
    },
    _first: {
      _after: {
        top: "calc(50%)",
      },
    },
    _last: {
      _after: {
        bottom: "calc(50%)",
      },
    },
  }),
  block_start: css({ _after: { left: 0 } }),
  block_end: css({ _after: { right: 0 } }),
  button: css({
    bg: "blue.800",
    borderRadius: "xs",
    px: 1,
    fontSize: "xs",
    cursor: "pointer",
    _hover: {
      bg: "blue.700",
    },
    _active: {
      transform: "translateY(1px)",
    },
  }),
};
