import { Tabs } from "@kobalte/core/tabs";
import { css } from "@styles/css";
import { VStack } from "@styles/jsx";
import { createSignal, For } from "solid-js";
import { useStore } from "~/store";
import { Guitar } from "./Guitar";
import { Strings } from "./Strings";

export function InstrumentTabs() {
  const store = useStore();
  const [current, setCurrent] = createSignal("bass");

  const instruments = () => Object.keys(store.instruments);

  return (
    <VStack alignItems="stretch" gap={4}>
      <Tabs value={current()} onChange={setCurrent}>
        <Tabs.List class={styles.list}>
          <For each={instruments()}>
            {(item) => (
              <Tabs.Trigger value={item} class={styles.trigger}>
                {item}
              </Tabs.Trigger>
            )}
          </For>
          <Tabs.Indicator class={styles.indicator} />
        </Tabs.List>
      </Tabs>

      <Strings instrument={current()} />
      <Guitar instrument={current()} />
    </VStack>
  );
}

const styles = {
  list: css({
    position: "relative",
    display: "flex",
    borderBottom: "2px solid black",
  }),
  trigger: css({
    px: 2,
    py: 1,
    cursor: "pointer",
    borderTopRadius: "sm",
    _selected: {
      backgroundColor: "neutral.500",
    },
    _hover: {
      backgroundColor: "neutral.600",
    },
  }),
  indicator: css({
    position: "absolute",
    backgroundColor: "blue.800",
    transition: "all 250ms",
    bottom: "-2px",
    height: "2px",
  }),
};
