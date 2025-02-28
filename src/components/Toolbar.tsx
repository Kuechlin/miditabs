import { NumberField } from "@kobalte/core/number-field";
import { Button } from "@kobalte/core/button";
import { css } from "@styles/css";
import { HStack } from "@styles/jsx";
import { useActions, useStore } from "~/store";

const guitar = ["E4", "B3", "G3", "D3", "A2", "E2"];
const bass = ["G2", "D2", "A1", "E1"];

export function Toolbar() {
  const store = useStore();
  const { addString, removeString, setStrings, play, setBpm } = useActions();
  return (
    <HStack>
      <Button class={styles.button} onClick={play}>
        play
      </Button>
      <Button class={styles.button} onClick={addString}>
        add string
      </Button>
      <Button class={styles.button} onClick={removeString}>
        remove string
      </Button>
      <Button class={styles.button} onClick={() => setStrings(guitar)}>
        set guitar
      </Button>
      <Button class={styles.button} onClick={() => setStrings(bass)}>
        set bass
      </Button>
      <NumberField rawValue={store.bpm} onRawValueChange={setBpm}>
        <NumberField.Input />
      </NumberField>
    </HStack>
  );
}
const styles = {
  button: css({
    cursor: "pointer",
    fontSize: "xs",
    bg: "blue.600",
    borderColor: "blue.800",
    borderRadius: "sm",
    px: "1",
    _hover: {
      bg: "blue.700",
    },
    _active: {
      transform: "translateY(1px)",
    },
  }),
};
