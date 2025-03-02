import { NumberField } from "@kobalte/core/number-field";
import { Button } from "@kobalte/core/button";
import { css } from "@styles/css";
import { HStack } from "@styles/jsx";
import { useActions, useStore } from "~/store";
import { instruments } from "~/store/instruments";
import { Match, Switch } from "solid-js";

export function Toolbar() {
  const store = useStore();
  const { addString, removeString, setStrings, play, pause, setBpm } =
    useActions();
  return (
    <HStack>
      <Switch>
        <Match when={store.state === "idle"}>
          <Button class={styles.button} onClick={play}>
            play
          </Button>
        </Match>
        <Match when={store.state === "playing"}>
          <Button class={styles.button} onClick={pause}>
            stop
          </Button>
        </Match>
      </Switch>
      <Button class={styles.button} onClick={addString}>
        add string
      </Button>
      <Button class={styles.button} onClick={removeString}>
        remove string
      </Button>
      <Button
        class={styles.button}
        onClick={() =>
          setStrings("guitar_electric", instruments.guitar_electric.notes)
        }
      >
        set guitar
      </Button>
      <Button
        class={styles.button}
        onClick={() =>
          setStrings("bass_electric", instruments.bass_electric.notes)
        }
      >
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
