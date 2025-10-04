import { ParentProps } from "solid-js";
import { Button } from "./Button";
import { useStore } from "~/store";

export function UploadButton(
  props: ParentProps<{
    onUploaded?: (content: string) => void;
  }>,
) {
  let fileInputRef: HTMLInputElement | undefined;

  const handleButtonClick = () => {
    fileInputRef?.click();
  };

  const handleFileChange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type === "application/json") {
      const text = await file.text();
      props.onUploaded?.(text);
      // Reset the input value so the same file can be uploaded again if needed
      target.value = "";
    }
  };

  return (
    <>
      <Button onClick={handleButtonClick}>{props.children}</Button>
      <input
        type="file"
        accept=".json,application/json"
        ref={(el) => (fileInputRef = el)}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}

export function DownloadButton(
  props: ParentProps<{ getData: () => { data: string; filename: string } }>,
) {
  const handleDownload = () => {
    const { data, filename } = props.getData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return <Button onClick={handleDownload}>{props.children}</Button>;
}
