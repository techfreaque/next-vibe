import { Box, Text } from "ink";
import type { JSX } from "react";

import type {
  CommandProps,
  CommandDialogProps,
  CommandInputProps,
  CommandListProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandSeparatorProps,
  CommandItemProps,
  CommandShortcutProps,
} from "../../web/ui/command";

export type {
  CommandProps,
  CommandDialogProps,
  CommandInputProps,
  CommandListProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandSeparatorProps,
  CommandItemProps,
  CommandShortcutProps,
} from "../../web/ui/command";

// CLI: passthrough wrappers — command UI has no terminal equivalent
// but child content (items, groups) should still render

export function Command({ children }: CommandProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}
Command.displayName = "Command";

export function CommandDialog({ children }: CommandDialogProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}

export function CommandInput({
  placeholder,
}: CommandInputProps): JSX.Element | null {
  if (!placeholder) {
    return null;
  }
  return <Text dimColor>{placeholder}</Text>;
}
CommandInput.displayName = "CommandInput";

export function CommandList({ children }: CommandListProps): JSX.Element {
  return <Box flexDirection="column">{children}</Box>;
}
CommandList.displayName = "CommandList";

export function CommandEmpty({ children }: CommandEmptyProps): JSX.Element {
  return <Text dimColor>{children}</Text>;
}
CommandEmpty.displayName = "CommandEmpty";

export function CommandGroup({
  children,
  heading,
}: CommandGroupProps): JSX.Element {
  return (
    <Box flexDirection="column">
      {heading ? <Text bold>{heading}</Text> : null}
      {children}
    </Box>
  );
}
CommandGroup.displayName = "CommandGroup";

// CommandSeparator has no visual equivalent in terminal — omit all props
export function CommandSeparator(): null {
  return null;
}
CommandSeparator.displayName = "CommandSeparator";

export function CommandItem({ children }: CommandItemProps): JSX.Element {
  return <Text>{children}</Text>;
}
CommandItem.displayName = "CommandItem";

export function CommandShortcut({
  children,
}: CommandShortcutProps): JSX.Element {
  return <Text dimColor>{children}</Text>;
}
CommandShortcut.displayName = "CommandShortcut";
