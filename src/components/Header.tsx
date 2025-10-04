import { css } from "@styles/css";
import { Box, HStack } from "@styles/jsx";
import { useActions } from "~/store";
import { DownloadButton, UploadButton } from "./atoms/FileButton";

export function Header() {
  const { exportJSON, importJSON } = useActions();
  return (
    <HStack>
      <h1 class={css({ fontSize: "4xl", fontWeight: "bolder" })}>miditabs</h1>
      <Box flex={1} />
      <DownloadButton getData={exportJSON}>Export</DownloadButton>
      <UploadButton onUploaded={importJSON}>Import</UploadButton>
    </HStack>
  );
}
