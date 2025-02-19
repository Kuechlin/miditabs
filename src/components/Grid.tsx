import { For, Index } from "solid-js";
import { css } from "@styles/css";
import { HStack, VStack } from "@styles/jsx";
import { useActions, useStore } from "~/store";

export function Grid() {
  const {
    play,
    moveLeft,
    moveRight,
    moveTo,
    removeNotes,
    deleteCol,
    insertCol,
  } = useActions();
  const store = useStore();
  return (
    <VStack alignItems="stretch">
      <HStack>
        <button class={styles.button} onClick={play}>
          play
        </button>
        <button class={styles.button} onClick={moveLeft}>
          left
        </button>
        <button class={styles.button} onClick={moveRight}>
          right
        </button>
        <button class={styles.button} onClick={removeNotes}>
          clear
        </button>
        <button class={styles.button} onClick={deleteCol}>
          delete
        </button>
        <button class={styles.button} onClick={insertCol}>
          insert
        </button>
      </HStack>
      <div class={styles.grid}>
        <For each={store.notes}>
          {(note, x) => (
            <div
              class={styles.col}
              bool:data-selected={store.cursor === x()}
              onClick={() => moveTo(x())}
            >
              <Index each={store.strings}>
                {(_, y) => (
                  <div
                    class={styles.cell}
                    classList={{ [styles.block]: x() % 8 === 0 }}
                  >
                    <span>{note.notes[y] ?? ""}</span>
                  </div>
                )}
              </Index>
            </div>
          )}
        </For>
        <div></div>
      </div>
    </VStack>
  );
}

const styles = {
  grid: css({
    display: "flex",
    width: "100%",
    overflowX: "scroll",
  }),
  col: css({
    _selected: {
      bg: "neutral.900",
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
    "& span": {
      zIndex: 2,
    },
  }),
  mark: css({
    color: "white",
  }),
  block: css({
    borderLeft: "4px solid black",
  }),
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
