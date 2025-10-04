import { css } from "@styles/css";
import { HStack, VStack } from "@styles/jsx";
import { For, Index } from "solid-js";
import { useActions, useStore } from "~/store";
import { Button } from "./atoms/Button";
import { NumberInput, SelectInput, TextInput } from "./atoms/Input";

export function Grid(props: { s: number }) {
  const { moveTo, setBpm, play, pause, removeSection, setName, setInstrument } =
    useActions();
  const store = useStore();

  const section = () => store.sections[props.s];
  const instrument = () => store.instruments[section().instrument];

  return (
    <VStack alignItems="flex-start" class={styles.section}>
      <HStack>
        <TextInput
          label="section"
          value={section().name}
          onChange={(v) => setName(props.s, v)}
        />
        <NumberInput
          label="bpm"
          value={section().bpm}
          onChange={(value) => setBpm(props.s, value)}
        />
        <SelectInput
          label="instrument"
          value={section().instrument}
          data={["bass", "guitar"]}
          onChange={(value) => setInstrument(props.s, value)}
        />
        <Button onClick={() => play(props.s)}>play</Button>
        <Button onClick={pause}>stop</Button>
        <Button mode="danger" onClick={() => removeSection(props.s)}>
          delete
        </Button>
      </HStack>
      <div class={styles.grid}>
        <For each={section().notes}>
          {(note, x) => (
            <div
              class={styles.col}
              bool:data-selected={
                store.cursor.s === props.s && store.cursor.x === x()
              }
            >
              <Index each={instrument().strings}>
                {(_, y) => (
                  <div
                    class={styles.cell}
                    classList={{
                      [styles.block]: x() % 8 === 0 || x() % 8 === 7,
                      [styles.block_start]: x() % 8 === 0,
                      [styles.block_end]: x() % 8 === 7,
                    }}
                    onClick={() => moveTo(props.s, x(), y)}
                    bool:data-selected={
                      store.cursor.s === props.s &&
                      store.cursor.y === y &&
                      store.cursor.x === x()
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
    </VStack>
  );
}

const styles = {
  section: css({
    borderLeft: "8px solid",
    borderColor: "neutral.900",
    pl: 2,
    borderRadius: "sm",
  }),
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
