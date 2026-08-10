/* eslint-disable oxlint-plugin-i18n/no-literal-string */
/**
 * CLI DropdownMenu
 *
 * DropdownMenuTrigger registers with Ink's useFocus for Tab navigation.
 * Enter/Space opens, Esc closes. Items are focusable with Enter to select.
 */
import { Box, Text, useFocus, useFocusManager, useInput, useStdin } from "ink";
import * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuPortalProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuRootProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
} from "../../web/components/dropdown-menu";

import { useIsMcp } from "../../../unified-ui/_shared/use-widget-context";
import type {
  DropdownMenuCheckboxItemProps,
  DropdownMenuContentProps,
  DropdownMenuGroupProps,
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuPortalProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuRootProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubContentProps,
  DropdownMenuSubProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuTriggerProps,
} from "../../web/components/dropdown-menu";
import { useShouldFocus } from "./dialog";

/**
 * Wrap bare string/number children in <Text> so Ink doesn't crash.
 * Also flattens React Fragments, since their children become direct
 * children of the parent <Box> at render time.
 */
function wrapTextChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <Text>{child}</Text>;
    }
    // Flatten Fragment children recursively
    if (React.isValidElement(child) && child.type === React.Fragment) {
      return wrapTextChildren(
        (child.props as { children?: React.ReactNode }).children,
      );
    }
    return child;
  });
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface DropdownMenuContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  /** When asChild, trigger skips own focus — child Button handles it */
  asChild: boolean;
  /** Item IDs registered in render order for focus management */
  itemIds: React.MutableRefObject<string[]>;
  /** Read the actual focus ID of the trigger element */
  getTriggerFocusId: () => string;
  /** Set the actual focus ID of the trigger element (may differ from triggerId for asChild) */
  setTriggerFocusId: (id: string) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null);

const EMPTY_ITEM_IDS: React.MutableRefObject<string[]> = {
  current: [],
};
const EMPTY_GET_TRIGGER_FOCUS_ID = (): string => "dropdown";
const EMPTY_SET_TRIGGER_FOCUS_ID: (id: string) => void = () => undefined;

function useDropdownMenuContext(): DropdownMenuContextType {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) {
    return {
      open: false,
      setOpen: () => undefined,
      triggerId: "dropdown",
      asChild: false,
      itemIds: EMPTY_ITEM_IDS,
      getTriggerFocusId: EMPTY_GET_TRIGGER_FOCUS_ID,
      setTriggerFocusId: EMPTY_SET_TRIGGER_FOCUS_ID,
    };
  }
  return ctx;
}

/**
 * Context for asChild triggers: lets child components (Button) know
 * they should toggle the dropdown on Enter/Space instead of (or alongside) onClick.
 */
interface DropdownTriggerContextType {
  toggle: () => void;
  /** Register the child's actual focus ID so it can be restored on close */
  registerFocusId: (id: string) => void;
}

const DropdownTriggerContext = createContext<DropdownTriggerContextType | null>(
  null,
);

/**
 * Hook for child components inside a DropdownMenuTrigger with asChild.
 * Returns the toggle function, or null if not inside one.
 */
export function useDropdownTrigger(): DropdownTriggerContextType | null {
  return useContext(DropdownTriggerContext);
}

// Monotonic counter for stable per-instance IDs
let dropdownIdCounter = 0;
let dropdownItemIdCounter = 0;

// ─── DropdownMenu Root ────────────────────────────────────────────────────────

export function DropdownMenu({
  children,
}: DropdownMenuRootProps): React.JSX.Element | null {
  const idRef = useRef(`dropdown-${(dropdownIdCounter++).toString()}`);
  const itemIdsRef = useRef<string[]>([]);
  const triggerFocusIdRef = useRef(idRef.current);
  const [open, setInternalOpen] = useState(false);

  const setOpen = useCallback((next: boolean): void => {
    setInternalOpen(next);
  }, []);

  const getTriggerFocusId = useCallback(
    (): string => triggerFocusIdRef.current,
    [],
  );
  const setTriggerFocusId = useCallback((id: string): void => {
    triggerFocusIdRef.current = id;
  }, []);

  return (
    <DropdownMenuContext.Provider
      value={{
        open,
        setOpen,
        triggerId: idRef.current,
        asChild: false,
        itemIds: itemIdsRef,
        getTriggerFocusId,
        setTriggerFocusId,
      }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
}

// ─── DropdownMenuTrigger ──────────────────────────────────────────────────────

/**
 * When asChild, child component (Button) owns focus registration.
 * Split into two components to avoid registering a ghost useFocus entry
 * that interferes with Ink's Tab focus order.
 */

function DropdownMenuTriggerAsChild({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element | null {
  const { open, setOpen, setTriggerFocusId } = useDropdownMenuContext();
  const isMcp = useIsMcp();

  const toggleFn = useCallback((): void => {
    setOpen(!open);
  }, [setOpen, open]);

  const registerFocusIdFn = useCallback(
    (id: string): void => {
      setTriggerFocusId(id);
    },
    [setTriggerFocusId],
  );

  const toggleRef = useRef({
    toggle: toggleFn,
    registerFocusId: registerFocusIdFn,
  });
  useEffect(() => {
    toggleRef.current.toggle = toggleFn;
    toggleRef.current.registerFocusId = registerFocusIdFn;
  });

  if (isMcp) {
    return null;
  }

  return (
    <DropdownTriggerContext.Provider value={toggleRef.current}>
      {children}
    </DropdownTriggerContext.Provider>
  );
}

function DropdownMenuTriggerOwn({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element | null {
  const { open, setOpen, triggerId } = useDropdownMenuContext();
  const isMcp = useIsMcp();
  const { isRawModeSupported } = useStdin();

  const shouldFocus = useShouldFocus();
  const { isFocused } = useFocus({
    id: triggerId,
    autoFocus: false,
    isActive: shouldFocus,
  });

  useInput(
    (input, key) => {
      if (key.return || input === " ") {
        setOpen(!open);
      } else if (key.escape && open) {
        setOpen(false);
      }
    },
    {
      isActive: isRawModeSupported && !isMcp && (isFocused || open),
    },
  );

  if (isMcp) {
    return null;
  }

  return (
    <Box>
      <Text color={isFocused || open ? "cyan" : "gray"}>
        {open ? "\u25BC " : "\u25B6 "}
      </Text>
      <Text color={isFocused || open ? "cyan" : undefined}>{children}</Text>
    </Box>
  );
}

export function DropdownMenuTrigger({
  children,
  asChild,
}: DropdownMenuTriggerProps): React.JSX.Element | null {
  if (asChild) {
    return <DropdownMenuTriggerAsChild>{children}</DropdownMenuTriggerAsChild>;
  }
  return <DropdownMenuTriggerOwn>{children}</DropdownMenuTriggerOwn>;
}

// ─── DropdownMenuContent ──────────────────────────────────────────────────────

export function DropdownMenuContent({
  children,
}: DropdownMenuContentProps): React.JSX.Element | null {
  const { open, setOpen, itemIds, getTriggerFocusId } =
    useDropdownMenuContext();
  const isMcp = useIsMcp();
  const { isRawModeSupported } = useStdin();
  const { focus } = useFocusManager();
  const prevOpenRef = useRef(false);

  // Focus first item on open, restore trigger focus on close
  React.useEffect(() => {
    if (open && !prevOpenRef.current) {
      const timer = setTimeout((): void => {
        const firstId = itemIds.current[0];
        if (firstId) {
          focus(firstId);
        }
      }, 0);
      prevOpenRef.current = true;
      return (): void => clearTimeout(timer);
    }
    if (!open && prevOpenRef.current) {
      focus(getTriggerFocusId());
      prevOpenRef.current = false;
    }
    return undefined;
  }, [open, focus, getTriggerFocusId, itemIds]);

  useInput(
    (input, key) => {
      void input;
      if (key.escape) {
        setOpen(false);
      }
    },
    { isActive: isRawModeSupported && !isMcp && open },
  );

  if (isMcp || !open) {
    return null;
  }

  return (
    <Box
      flexDirection="column"
      marginLeft={2}
      borderStyle="single"
      borderColor="cyan"
      paddingX={1}
    >
      {children}
    </Box>
  );
}

// ─── DropdownMenuItem ─────────────────────────────────────────────────────────

export function DropdownMenuItem({
  children,
  onSelect,
  onClick,
}: DropdownMenuItemProps): React.JSX.Element | null {
  const { setOpen, itemIds, getTriggerFocusId } = useDropdownMenuContext();
  const isMcp = useIsMcp();
  const { isRawModeSupported } = useStdin();
  const idRef = useRef(`dd-item-${(dropdownItemIdCounter++).toString()}`);
  const { focus: focusById } = useFocusManager();

  // Register item ID for focus management
  React.useEffect(() => {
    const id = idRef.current;
    const ids = itemIds.current;
    if (!ids.includes(id)) {
      ids.push(id);
    }
    return (): void => {
      const idx = ids.indexOf(id);
      if (idx !== -1) {
        ids.splice(idx, 1);
      }
    };
  }, [itemIds]);

  const shouldFocusItem = useShouldFocus();
  const { isFocused } = useFocus({
    id: idRef.current,
    autoFocus: false,
    isActive: shouldFocusItem,
  });

  useInput(
    (input, key) => {
      if (key.return || input === " ") {
        if (onSelect) {
          onSelect(new Event("select"));
        }
        if (onClick) {
          onClick();
        }
        setOpen(false);
        focusById(getTriggerFocusId());
      }
    },
    { isActive: isRawModeSupported && !isMcp && isFocused },
  );

  if (isMcp) {
    return null;
  }

  return (
    <Box>
      <Text color={isFocused ? "cyan" : undefined}>
        {isFocused ? "> " : "  "}
      </Text>
      <Box>{wrapTextChildren(children)}</Box>
    </Box>
  );
}

// ─── Pass-through components ──────────────────────────────────────────────────

export function DropdownMenuGroup({
  children,
}: DropdownMenuGroupProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DropdownMenuPortal({
  children,
}: DropdownMenuPortalProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DropdownMenuSub({
  children,
}: DropdownMenuSubProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DropdownMenuRadioGroup({
  children,
}: DropdownMenuRadioGroupProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DropdownMenuSubTrigger({
  children,
}: DropdownMenuSubTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

// Submenu flyouts don't work in CLI (no hover). Return null so the
// mobile/dialog fallback path is used instead.
export function DropdownMenuSubContent({
  children: _children,
}: DropdownMenuSubContentProps): React.JSX.Element | null {
  void _children;
  return null;
}

export function DropdownMenuCheckboxItem({
  children,
}: DropdownMenuCheckboxItemProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DropdownMenuRadioItem({
  children,
}: DropdownMenuRadioItemProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DropdownMenuLabel({
  children,
}: DropdownMenuLabelProps): React.JSX.Element | null {
  return (
    <Text bold dimColor>
      {children}
    </Text>
  );
}

export function DropdownMenuSeparator(): React.JSX.Element {
  return <Text dimColor>{"─".repeat(20)}</Text>;
}

export function DropdownMenuShortcut({
  children,
}: DropdownMenuShortcutProps): React.JSX.Element | null {
  return <Text dimColor>{children}</Text>;
}
