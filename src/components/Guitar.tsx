import { css } from "@styles/css";
import { Index } from "solid-js";
import * as Tone from "tone";
import { useActions, useStore } from "~/store";
import { Times } from "./Times";

const notes = 12;
const bars = [1, 3, 5, 7, 9, 12];

export function Guitar(props: { instrument: string }) {
  const store = useStore();
  const { insertNote } = useActions();

  const instrument = () => store.instruments[props.instrument];

  return (
    <div class={styles.root}>
      <Index each={instrument().strings}>
        {(item, string) => (
          <div class={styles.string}>
            <Times count={notes}>
              {(i) => (
                <button
                  class={`${styles.note} ${bars.includes(i) ? styles.bar : ""}`}
                  onClick={() => insertNote(store.cursor.s, string, i)}
                >
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
    position: "relative",
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
  bar: css({
    "&::after,&::before": {
      position: "absolute",
      left: "calc(50% - 2px)",
      content: "' '",
      display: "flex",
      backgroundColor: "black",
      width: "4px",
      zIndex: 1,
    },
    _before: {
      top: "-4px",
      height: "4px",
    },
    _after: {
      bottom: "-4px",
      height: "4px",
    },
  }),
};
