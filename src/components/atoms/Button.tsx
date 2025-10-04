import { Button as KButton } from "@kobalte/core/button";
import { cva } from "@styles/css";
import { ParentProps } from "solid-js/types/server/rendering.js";

export function Button(
  props: ParentProps<{ onClick?: () => void; mode?: "primary" | "danger" }>,
) {
  return (
    <KButton
      onClick={props.onClick}
      class={button({ mode: props.mode ?? "primary" })}
    >
      {props.children}
    </KButton>
  );
}

const button = cva({
  base: {
    cursor: "pointer",
    fontSize: "xs",
    bg: "blue.600",
    borderRadius: "sm",
    px: "2",
    py: "1",
    boxShadow: "0px 2px 0px 1px  black",
    fontWeight: "bold",
    _active: {
      transform: "translateY(1px)",
      boxShadow: "0px 1px 0px 1px  black",
    },
  },
  variants: {
    mode: {
      primary: {
        bg: "neutral.500",
        _hover: {
          bg: "neutral.600",
        },
      },
      danger: {
        bg: "red.600",
        _hover: {
          bg: "red.700",
        },
      },
    },
  },
});
