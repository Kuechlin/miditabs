import { NumberField } from "@kobalte/core/number-field";
import { Select } from "@kobalte/core/select";
import { TextField } from "@kobalte/core/text-field";
import { sva } from "@styles/css";

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

export function SelectInput(props: {
  label?: string;
  value: string;
  onChange?(value: string): void;
  data: string[];
}) {
  const styles = input();
  return (
    <Select
      class={styles.root}
      value={props.value}
      options={props.data}
      gutter={4}
      onChange={(value) => value && props.onChange?.(value)}
      itemComponent={(props) => (
        <Select.Item item={props.item} class={styles.selectItem}>
          <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
        </Select.Item>
      )}
    >
      {props.label && (
        <Select.Label class={styles.label}>{props.label}</Select.Label>
      )}
      <Select.Trigger class={styles.input}>
        <Select.Value<string>>{(state) => state.selectedOption()}</Select.Value>
        <Select.Icon />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content class={styles.protal}>
          <Select.Listbox class={styles.listbox} />
        </Select.Content>
      </Select.Portal>
    </Select>
  );
}

const input = sva({
  slots: ["root", "label", "input", "protal", "listbox", "selectItem"],
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
      width: "100px",
      display: "inline-flex",
      justifyContent: "space-between",
      outline: "none",
      _expanded: {
        borderColor: "blue.700",
      },
      _focusVisible: {
        borderColor: "blue.700",
      },
    },
    protal: {
      zIndex: 99,
      backgroundColor: "neutral.800",
      border: "2px solid black",
      borderRadius: "sm",
      borderTopRadius: "none",
    },
    listbox: {
      padding: 1,
      display: "flex",
      flexDirection: "column",
      gap: 1,
    },
    selectItem: {
      display: "flex",
      justifyContent: "space-between",
      borderRadius: "sm",
      outline: "none",
      _selected: {
        backgroundColor: "neutral.600",
        px: 1,
      },
      _hover: {
        backgroundColor: "neutral.700",
      },
    },
  },
});
