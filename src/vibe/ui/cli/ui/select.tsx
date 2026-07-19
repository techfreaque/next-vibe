/**
 * CLI Select - interactive keyboard navigation
 * Items are collected via SelectItem children, Select manages state
 */
import { Box, Text, useFocus, useInput } from "ink";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  SelectContentProps,
  SelectGroupProps,
  SelectItemProps,
  SelectLabelProps,
  SelectRootProps,
  SelectSeparatorProps,
  SelectTriggerProps,
  SelectValueProps,
} from "../../web/ui/select";
import {
  useFocusScopeRegister,
  useOverlayLock,
  useShouldFocus,
} from "./dialog";

export type {
  SelectContentProps,
  SelectGroupProps,
  SelectItemProps,
  SelectLabelProps,
  SelectOption,
  SelectRootProps,
  SelectSeparatorProps,
  SelectTriggerProps,
  SelectValueProps,
} from "../../web/ui/select";

interface SelectContextType {
  value: string | undefined;
  onValueChange: ((v: string) => void) | undefined;
  disabled: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  cursor: number;
  setCursor: (c: number) => void;
  registerItem: (value: string, label: string, disabled: boolean) => () => void;
  items: Array<{ value: string; label: string; disabled: boolean }>;
  isFocused: boolean;
}

const SelectContext = createContext<SelectContextType | null>(null);

function useSelectContext(): SelectContextType {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    return {
      value: undefined,
      onValueChange: undefined,
      disabled: false,
      open: false,
      setOpen: () => undefined,
      cursor: 0,
      setCursor: () => undefined,
      registerItem: () => () => undefined,
      items: [],
      isFocused: false,
    };
  }
  return ctx;
}

const ARROW = "\u25B6";
const SPACE = "\u0020";
const CHECK = "\u2713";
const BLANK = "\u0020";
// Terminal-only hint strings - not user-facing i18n content
const HINT_NAV =
  "\u2191\u2193/Tab navigate \u00b7 Enter select \u00b7 Esc cancel";
const SEPARATOR_LINE =
  "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500";

export function Select<TValue extends string>({
  children,
  value,
  onValueChange,
  disabled = false,
}: SelectRootProps<TValue>): JSX.Element {
  const isMcp = useIsMcp();
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const itemsRef = useRef<
    Array<{ value: string; label: string; disabled: boolean }>
  >([]);
  const [, forceUpdate] = useState(0);
  // Stable ID for Ink's focus system
  const idRef = useRef(`select-${Math.random().toString(36).slice(2, 7)}`);
  // Cursor position when dropdown was opened — restored on Esc/Left cancel
  const openCursorRef = useRef(0);
  const shouldFocus = useShouldFocus();
  const { isFocused } = useFocus({
    id: idRef.current,
    autoFocus: false,
    isActive: shouldFocus,
  });
  useFocusScopeRegister(idRef.current);
  // Lock overlay when open — deactivates Tab navigation outside the select
  useOverlayLock(open);

  const registerItem = useCallback(
    (itemValue: string, label: string, itemDisabled: boolean) => {
      const item = { value: itemValue, label, disabled: itemDisabled };
      // Avoid duplicates
      const existing = itemsRef.current.findIndex((i) => i.value === itemValue);
      if (existing >= 0) {
        itemsRef.current[existing] = item;
      } else {
        itemsRef.current = [...itemsRef.current, item];
        forceUpdate((n) => n + 1);
      }
      return (): void => {
        itemsRef.current = itemsRef.current.filter(
          (i) => i.value !== itemValue,
        );
        forceUpdate((n) => n + 1);
      };
    },
    [],
  );

  const enabledItems = itemsRef.current.filter((i) => !i.disabled);

  useInput(
    (input, key) => {
      if (disabled) {
        return;
      }

      if (!open) {
        if (key.return || key.rightArrow) {
          // Find cursor position of current value and save it as the cancel restore point
          const idx = enabledItems.findIndex((i) => i.value === value);
          const startIdx = Math.max(idx, 0);
          setCursor(startIdx);
          openCursorRef.current = startIdx;
          setOpen(true);
        }
        return;
      }

      if (key.escape || key.leftArrow) {
        // Restore cursor to where it was when opened (cancel)
        setCursor(openCursorRef.current);
        setOpen(false);
        return;
      }

      // Tab/Shift+Tab cycle through items when open (mirrors arrow behavior)
      if (key.tab) {
        if (key.shift) {
          setCursor((c) => Math.max(0, c - 1));
        } else {
          setCursor((c) => Math.min(enabledItems.length - 1, c + 1));
        }
        return;
      }

      if (key.upArrow) {
        setCursor((c) => Math.max(0, c - 1));
        return;
      }

      if (key.downArrow) {
        setCursor((c) => Math.min(enabledItems.length - 1, c + 1));
        return;
      }

      if (key.return || input === " ") {
        const item = enabledItems[cursor];
        if (item) {
          onValueChange?.(item.value as TValue);
        }
        setOpen(false);
      }
    },
    { isActive: !isMcp && !disabled && (isFocused || open) },
  );

  const ctx: SelectContextType = useMemo(
    () => ({
      value,
      onValueChange: onValueChange as ((v: string) => void) | undefined,
      disabled,
      open,
      setOpen,
      cursor,
      setCursor,
      registerItem,
      items: itemsRef.current,
      isFocused,
    }),
    [
      value,
      onValueChange,
      disabled,
      open,
      setOpen,
      cursor,
      setCursor,
      registerItem,
      isFocused,
    ],
  );

  return (
    <SelectContext.Provider value={ctx}>
      <Box flexDirection="column">{children}</Box>
    </SelectContext.Provider>
  );
}
Select.displayName = "Select";

export function SelectGroup({ children }: SelectGroupProps): JSX.Element {
  return <>{children}</>;
}
SelectGroup.displayName = "SelectGroup";

export function SelectValue({ placeholder }: SelectValueProps): JSX.Element {
  const { value, items, disabled, open, isFocused } = useSelectContext();
  const isMcp = useIsMcp();

  // Only use value as label when items have been registered; before that show placeholder
  const matchedItem = items.find((i) => i.value === value);
  const selectedLabel =
    items.length > 0 ? (matchedItem?.label ?? value) : undefined;
  const display = selectedLabel ?? placeholder ?? "select";

  if (isMcp) {
    return <Text>{display}</Text>;
  }

  const isActive = isFocused || open;
  // Text-based focus: «...» when focused, [...] when not.
  // Survives ANSI stripping so agents can detect focus in frame capture.
  const open_ = isFocused ? "«" : "[";
  const close_ = isFocused ? "»" : "]";
  return (
    <Text
      dimColor={!selectedLabel}
      color={disabled ? undefined : isActive ? "cyan" : "gray"}
    >
      {open_}
      {open ? `▼ ${display}` : `▶ ${display}`}
      {close_}
    </Text>
  );
}
SelectValue.displayName = "SelectValue";

export function SelectTrigger({ children }: SelectTriggerProps): JSX.Element {
  return <>{children}</>;
}
SelectTrigger.displayName = "SelectTrigger";

export function SelectScrollUpButton(
  props: SelectLabelProps,
): JSX.Element | null {
  void props;
  return null;
}
SelectScrollUpButton.displayName = "SelectScrollUpButton";

export function SelectScrollDownButton(
  props: SelectLabelProps,
): JSX.Element | null {
  void props;
  return null;
}
SelectScrollDownButton.displayName = "SelectScrollDownButton";

export function SelectContent({ children }: SelectContentProps): JSX.Element {
  const { open } = useSelectContext();
  const isMcp = useIsMcp();

  if (isMcp) {
    return <>{children}</>;
  }

  // Always render children so SelectItem useEffect can register items.
  // Items themselves return null when !ctx.open, so only visible when open.
  // Stable single Box so Ink never remounts SelectItem children.
  // Hint and separator only show when open; items self-hide via ctx.open check.
  return (
    <Box flexDirection="column">
      {open ? <Text dimColor>{HINT_NAV}</Text> : null}
      {children}
      {open ? <Text dimColor>{SEPARATOR_LINE}</Text> : null}
    </Box>
  );
}
SelectContent.displayName = "SelectContent";

export function SelectLabel(props: SelectLabelProps): JSX.Element | null {
  const { open } = useSelectContext();
  if (!open) {
    return null;
  }
  return <Text dimColor>{props.children}</Text>;
}
SelectLabel.displayName = "SelectLabel";

export function SelectItem({
  value,
  children,
  disabled = false,
}: SelectItemProps): JSX.Element | null {
  const ctx = useSelectContext();
  const isMcp = useIsMcp();
  const label = typeof children === "string" ? children : (value ?? "");

  const { registerItem } = ctx;
  // Register this item with the parent Select
  useEffect(() => {
    return registerItem(value, label, disabled);
  }, [registerItem, value, label, disabled]);

  // In MCP mode, show nothing (Select collects items via registration)
  if (isMcp) {
    return null;
  }

  // Only render visually when open
  if (!ctx.open) {
    return null;
  }

  const isSelected = ctx.value === value;
  const isCursor =
    ctx.items.filter((i) => !i.disabled).findIndex((i) => i.value === value) ===
    ctx.cursor;

  return (
    <Box>
      <Text
        color={isCursor ? "cyan" : disabled ? "gray" : undefined}
        dimColor={disabled}
      >
        {isCursor ? ARROW : SPACE}
        {SPACE}
        {isSelected ? CHECK : BLANK}
        {SPACE}
        {children ?? value}
      </Text>
    </Box>
  );
}
SelectItem.displayName = "SelectItem";

export function SelectSeparator(
  props: SelectSeparatorProps,
): JSX.Element | null {
  void props;
  const { open } = useSelectContext();
  if (!open) {
    return null;
  }
  return <Text dimColor>{SEPARATOR_LINE}</Text>;
}
SelectSeparator.displayName = "SelectSeparator";
