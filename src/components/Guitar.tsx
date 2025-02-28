import { css } from "@styles/css";
import { Index } from "solid-js";
import * as Tone from "tone";
import { useActions, useStore } from "~/store";
import { Times } from "./Times";

const notes = 12;

export function Guitar() {
  const { insertNote } = useActions();
  const store = useStore();

  async function play(string: number, i: number) {
    insertNote(string, i);
  }

  return (
    <div class={styles.root}>
      <Index each={store.strings}>
        {(item, string) => (
          <div class={styles.string}>
            <Times count={notes}>
              {(i) => (
                <button class={styles.note} onClick={() => play(string, i)}>
                  {Tone.Frequency(item()).transpose(i).toNote()}
                </button>
              )}
            </Times>
          </div>
        )}
      </Index>
    </div>
  );
}

const styles = {
  root: css({
    display: "flex",
    flexDirection: "column",
    backgroundColor: "neutral.700",
    borderLeftRadius: 8,
    overflow: "hidden",
  }),
  wrapper: css({
    display: "flex",
  }),
  string: css({
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    _before: {
      content: "' '",
      display: "block",
      position: "absolute",
      top: "calc(50% - 1px)",
      left: 0,
      right: 0,
      bg: "black",
      height: "4px",
      zIndex: 1,
    },
  }),
  note: css({
    zIndex: 2,
    bg: "blue.500",
    height: 6,
    width: 6,
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "xs",
    _hover: {
      bg: "blue.700",
    },
    margin: 1,
    _first: {
      borderRadius: 0,
      bg: "neutral.600",
      textAlign: "center",
      padding: 1,
      margin: 0,
      width: 8,
      height: 8,
      _hover: {
        bg: "neutral.500",
      },
    },
    _last: {
      marginRight: 8,
    },
  }),
};
