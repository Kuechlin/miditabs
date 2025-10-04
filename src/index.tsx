/* @refresh reload */
import { VStack } from "@styles/jsx";
import { render } from "solid-js/web";
import { GridSections } from "./components/GridSections";
import { InstrumentTabs } from "./components/InstrumentsTabs";
import "./index.css";
import { StoreProvider } from "./store";
import { css } from "@styles/css";
import { Header } from "./components/Header";

const root = document.getElementById("root");

function Root() {
  return (
    <StoreProvider>
      <VStack alignItems="stretch" gap={8}>
        <Header />
        <InstrumentTabs />

        <h2 class={css({ fontSize: "xl", fontWeight: "bold" })}>Sections</h2>
        <GridSections />
      </VStack>
    </StoreProvider>
  );
}

render(() => <Root />, root!);
