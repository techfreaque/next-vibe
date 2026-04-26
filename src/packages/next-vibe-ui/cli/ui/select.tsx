/**
 * CLI Select - interactive keyboard navigation
 * Items are collected via SelectItem children, Select manages state
 */
import { Box, Text, useInput } from "ink";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type {
  SelectRootProps,
  SelectGroupProps,
  SelectValueProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectItemProps,
  SelectLabelProps,
  SelectSeparatorProps,
} from "../../web/ui/select";

export type {
  SelectRootProps,
  SelectGroupProps,
  SelectValueProps,
  SelectTriggerProps,
  SelectContentProps,
  SelectItemProps,
  SelectLabelProps,
  SelectSeparatorProps,
  SelectOption,
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
    };
  }
  return ctx;
}

const ARROW = "\u25B6";
const SPACE = "\u0020";
const CHECK = "\u2713";
const BLANK = "\u0020";
// Terminal-only hint strings - not user-facing i18n content
const HINT_NAV = "\u2191\u2193 navigate, Enter select, Esc cancel";
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
        if (key.return || key.downArrow || key.upArrow) {
          // Find cursor position of current value
          const idx = enabledItems.findIndex((i) => i.value === value);
          setCursor(idx >= 0 ? idx : 0);
          setOpen(true);
        }
        return;
      }

      if (key.escape) {
        setOpen(false);
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
    { isActive: !isMcp && !disabled },
  );

  const ctx: SelectContextType = {
    value,
    onValueChange: onValueChange as ((v: string) => void) | undefined,
    disabled,
    open,
    setOpen,
    cursor,
    setCursor,
    registerItem,
    items: itemsRef.current,
  };

  return (
    <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>
  );
}
Select.displayName = "Select";

export function SelectGroup({ children }: SelectGroupProps): JSX.Element {
  return <>{children}</>;
}
SelectGroup.displayName = "SelectGroup";

export function SelectValue({ placeholder }: SelectValueProps): JSX.Element {
  const { value, items, disabled, open } = useSelectContext();
  const isMcp = useIsMcp();

  const selectedLabel = items.find((i) => i.value === value)?.label ?? value;
  const display = selectedLabel ?? placeholder ?? "select";

  if (isMcp) {
    return <Text>{display}</Text>;
  }

  return (
    <Text dimColor={!selectedLabel} color={disabled ? undefined : "cyan"}>
      {open ? `▼ ${display}` : `▶ ${display}`}
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

  // Always render children (so SelectItem can register themselves)
  // But only show visually when open (in non-MCP mode)
  if (isMcp) {
    return <>{children}</>;
  }

  if (!open) {
    // Still render children invisibly so items can register
    return <Box display="flex">{children}</Box>;
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text dimColor>{HINT_NAV}</Text>
      {children}
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

  // Register this item with the parent Select
  useEffect(() => {
    return ctx.registerItem(value, label, disabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, label, disabled]);

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
