import { css } from "@styles/css";
import { HStack } from "@styles/jsx";
import { Index } from "solid-js";
import { useActions, useStore } from "~/store";

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const octaves = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function Strings() {
  const store = useStore();
  const { setString } = useActions();

  return (
    <HStack>
      <Index each={store.strings}>
        {(item, i) => (
          <StringInput value={item()} onChange={(val) => setString(i, val)} />
        )}
      </Index>
    </HStack>
  );
}

const getLen = (val: string) => (val[1] === "#" ? 2 : 1);
function StringInput(props: { value: string; onChange(value: string): void }) {
  const note = () => props.value.substring(0, getLen(props.value));
  const octave = () => Number(props.value.substring(getLen(props.value)));

  return (
    <div>
      <select
        class={styles.input}
        value={note()}
        onChange={(e) => props.onChange(e.target.value + octave())}
      >
        {notes.map((n) => (
          <option value={n}>{n}</option>
        ))}
      </select>
      <select
        class={styles.input}
        value={octave()}
        onChange={(e) => props.onChange(note() + e.target.value)}
      >
        {octaves.map((o) => (
          <option value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

const styles = {
  input: css({
    cursor: "pointer",
    border: "2px solid black",
    _first: {
      borderLeftRadius: "md",
      borderRight: "none",
    },
    _last: {
      borderRightRadius: "md",
      borderLeft: "none",
    },
  }),
};
