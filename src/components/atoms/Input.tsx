import { NumberField } from "@kobalte/core/number-field";
import { TextField } from "@kobalte/core/text-field";
import { css, sva } from "@styles/css";

export function TextInput(props: {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
}) {
  const styles = input();
  return (
    <TextField
      class={styles.root}
      value={props.value}
      onChange={props.onChange}
    >
      {props.label && (
        <TextField.Label class={styles.label}>{props.label}</TextField.Label>
      )}
      <TextField.Input class={styles.input} />
    </TextField>
  );
}

export function NumberInput(props: {
  label?: string;
  value: number;
  onChange?: (value: number) => void;
}) {
  const styles = input();
  return (
    <NumberField
      class={styles.root}
      rawValue={props.value}
      onRawValueChange={(value) => props.onChange?.(value)}
    >
      {props.label && (
        <NumberField.Label class={styles.label}>
          {props.label}
        </NumberField.Label>
      )}
      <NumberField.Input class={styles.input} />
    </NumberField>
  );
}

const input = sva({
  slots: ["root", "label", "input"],
  base: {
    root: {
      position: "relative",
    },
    label: {
      position: "absolute",
      backgroundColor: "#222",
      lineHeight: 1,
      fontSize: "xs",
      top: -1.5,
      left: 2,
      px: 0.5,
    },
    input: {
      border: "2px solid black",
      borderRadius: "sm",
      px: 2,
      py: 1,
    },
  },
});
