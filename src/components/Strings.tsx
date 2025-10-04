import { css } from "@styles/css";
import { HStack } from "@styles/jsx";
import { Index } from "solid-js";
import { useActions, useStore } from "~/store";
import { notes, octaves } from "~/store/instruments";
import { Button } from "./atoms/Button";

export function Strings(props: { instrument: string }) {
  const store = useStore();
  const { setString, addString, removeString } = useActions();

  const instrument = () => store.instruments[props.instrument];

  return (
    <HStack>
      <Index each={instrument().strings}>
        {(item, i) => (
          <StringInput
            value={item()}
            onChange={(val) => setString(props.instrument, i, val)}
          />
        )}
      </Index>

      <Button onClick={() => addString(props.instrument)}>add string</Button>
      <Button onClick={() => removeString(props.instrument)}>
        remove string
      </Button>
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
      pl: 2,
      py: 1,
    },
    _last: {
      borderRightRadius: "md",
      borderLeft: "none",
      py: 1,
      pl: 2,
    },
  }),
};
