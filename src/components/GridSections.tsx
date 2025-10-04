import { For } from "solid-js";
import { times } from "./Times";
import { useActions, useStore } from "~/store";
import { Grid } from "./Grid";
import { VStack } from "@styles/jsx";
import { Button } from "./atoms/Button";

export function GridSections() {
  const { addSection } = useActions();
  const store = useStore();

  const sections = () => times(store.sections.length, (i) => i);

  return (
    <VStack alignItems="flex-start" gap="8">
      <For each={sections()}>{(i) => <Grid s={i} />}</For>
      <Button onClick={addSection}>add section</Button>
    </VStack>
  );
}
