/* @refresh reload */
import { render } from "solid-js/web";
import { Guitar } from "./components/Guitar";
import "./index.css";
import { Grid } from "./components/Grid";
import { StoreProvider, useStore } from "./store";
import { VStack } from "@styles/jsx";
import { Strings } from "./components/Strings";
import { Toolbar } from "./components/Toolbar";

const root = document.getElementById("root");

function Root() {
  return (
    <StoreProvider strings={["E4", "B3", "G3", "D3", "A2", "E2"]}>
      <VStack alignItems="stretch">
        <Toolbar />
        <Strings />
        <Guitar />
        <Grid />
        {import.meta.env.DEV && <Dev />}
      </VStack>
    </StoreProvider>
  );
}

function Dev() {
  const store = useStore();
  return (
    <code>
      <p>{store.bpm}bpm</p>
      <pre>{JSON.stringify(store.notes, null, 2)}</pre>
    </code>
  );
}

render(() => <Root />, root!);
