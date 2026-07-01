import { Text } from "ink";
import type {
  FormAlertProps,
  FormAlertState,
} from "next-vibe/ui/web/ui/form/form-alert";
import type { JSX } from "react";

export type {
  FormAlertProps,
  FormAlertState,
} from "next-vibe/ui/web/ui/form/form-alert";

const VARIANT_COLOR: Record<FormAlertState["variant"], string> = {
  default: "white",
  destructive: "red",
  success: "green",
  warning: "yellow",
};

const SEPARATOR = "\u003A\u0020";

export function FormAlert({ alert }: FormAlertProps): JSX.Element | null {
  if (!alert || (!alert.title && !alert.message)) {
    return null;
  }

  const color = VARIANT_COLOR[alert.variant] ?? "white";

  return (
    <Text color={color}>
      {alert.title ? `${alert.title.message}${SEPARATOR}` : ""}
      {alert.message.message}
    </Text>
  );
}
