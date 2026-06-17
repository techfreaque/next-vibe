/* eslint-disable oxlint-plugin-i18n/no-literal-string */
/**
 * CLI Popover
 *
 * PopoverTrigger registers with Ink's useFocus for Tab navigation.
 * Enter/Space opens, Esc closes. Content renders inline below trigger.
 */
import process from "node:process";

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
  PopoverAnchorProps,
  PopoverCloseProps,
  PopoverContentProps,
  PopoverPortalProps,
  PopoverRootProps,
  PopoverTriggerProps,
} from "../../web/ui/popover";

import { useIsMcp } from "next-vibe-ui/unified/_shared/use-widget-context";

import type {
  PopoverAnchorProps,
  PopoverCloseProps,
  PopoverContentProps,
  PopoverPortalProps,
  PopoverRootProps,
  PopoverTriggerProps,
} from "../../web/ui/popover";
import {
  FocusScopeProvider,
  useFocusScopeRegister,
  useOverlayLock,
  useShouldFocus,
} from "./dialog";

// ─── Context ──────────────────────────────────────────────────────────────────

interface PopoverContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  /** Actual focus ID of the trigger element (may differ from triggerId for asChild) */
  triggerFocusId: React.MutableRefObject<string>;
}

const EMPTY_TRIGGER_FOCUS_ID: React.MutableRefObject<string> = {
  current: "popover",
};

const PopoverContext = createContext<PopoverContextType | null>(null);

function usePopoverContext(): PopoverContextType {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    return {
      open: false,
      setOpen: () => undefined,
      triggerId: "popover",
      triggerFocusId: EMPTY_TRIGGER_FOCUS_ID,
    };
  }
  return ctx;
}

/**
 * Context for asChild triggers: lets child components (Button) know
 * they should toggle the popover on Enter/Space.
 */
interface PopoverTriggerContextType {
  toggle: () => void;
  /** Register the child's actual focus ID so it can be restored on close */
  registerFocusId: (id: string) => void;
}

const PopoverTriggerContext = createContext<PopoverTriggerContextType | null>(
  null,
);

/**
 * Hook for child components inside a PopoverTrigger with asChild.
 * Returns the toggle function, or null if not inside one.
 */
export function usePopoverTrigger(): PopoverTriggerContextType | null {
  return useContext(PopoverTriggerContext);
}

// Monotonic counter for stable per-instance IDs
let popoverIdCounter = 0;

// ─── Popover Root ─────────────────────────────────────────────────────────────

export function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
}: PopoverRootProps): React.JSX.Element | null {
  const idRef = useRef(`popover-${(popoverIdCounter++).toString()}`);
  const triggerFocusIdRef = useRef(idRef.current);
  const [internalOpen, setInternalOpen] = useState(false);

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  // Register this popover as an active overlay
  useOverlayLock(open);

  const setOpen = useCallback(
    (next: boolean): void => {
      if (onOpenChange) {
        onOpenChange(next);
      } else {
        setInternalOpen(next);
      }
    },
    [onOpenChange],
  );

  return (
    <PopoverContext.Provider
      value={{
        open,
        setOpen,
        triggerId: idRef.current,
        triggerFocusId: triggerFocusIdRef,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

// ─── PopoverTrigger ───────────────────────────────────────────────────────────

/**
 * When asChild, child component (Button) owns focus registration.
 * Split into two components to avoid registering a ghost useFocus entry
 * that interferes with Ink's Tab focus order.
 */

function PopoverTriggerAsChild({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element | null {
  const { open, setOpen, triggerFocusId } = usePopoverContext();
  const isMcp = useIsMcp();

  const toggleFn = useCallback((): void => {
    setOpen(!open);
  }, [setOpen, open]);

  const registerFocusIdFn = useCallback(
    (id: string): void => {
      triggerFocusId.current = id;
    },
    [triggerFocusId],
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
    <PopoverTriggerContext.Provider value={toggleRef.current}>
      {children}
    </PopoverTriggerContext.Provider>
  );
}

function PopoverTriggerOwn({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element | null {
  const { open, setOpen, triggerId } = usePopoverContext();
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

export function PopoverTrigger({
  children,
  asChild,
}: PopoverTriggerProps): React.JSX.Element | null {
  if (asChild) {
    return <PopoverTriggerAsChild>{children}</PopoverTriggerAsChild>;
  }
  return <PopoverTriggerOwn>{children}</PopoverTriggerOwn>;
}

// ─── PopoverAnchor ────────────────────────────────────────────────────────────

export function PopoverAnchor({
  children,
}: PopoverAnchorProps): React.JSX.Element | null {
  return <>{children}</>;
}

// ─── PopoverPortal ────────────────────────────────────────────────────────────

export function PopoverPortal({
  children,
}: PopoverPortalProps): React.JSX.Element | null {
  return <>{children}</>;
}

// ─── PopoverCloseButton ──────────────────────────────────────────────────────

let popoverCloseIdCounter = 0;

/**
 * Inline close button for PopoverContent. Registers with FocusScopeProvider
 * so focus trapping works even when popover content has no other focusable items.
 */
function PopoverCloseButton({
  onClose,
}: {
  onClose: () => void;
}): React.JSX.Element {
  const idRef = useRef(`pop-close-${(popoverCloseIdCounter++).toString()}`);
  const { isRawModeSupported } = useStdin();
  const isMcp = useIsMcp();

  const { isFocused } = useFocus({
    id: idRef.current,
    autoFocus: false,
  });

  useFocusScopeRegister(idRef.current);

  useInput(
    (_input, key) => {
      if (key.return || _input === " ") {
        if (isFocused) {
          onClose();
        }
      }
    },
    { isActive: isRawModeSupported && !isMcp && isFocused },
  );

  return (
    <Box justifyContent="flex-end">
      <Text color={isFocused ? "cyan" : undefined} dimColor={!isFocused}>
        {isFocused ? "\u00AB" : "["}
        Close (Esc)
        {isFocused ? "\u00BB" : "]"}
      </Text>
    </Box>
  );
}

// ─── PopoverContent ───────────────────────────────────────────────────────────

export function PopoverContent({
  children,
}: PopoverContentProps): React.JSX.Element | null {
  const { open, setOpen, triggerFocusId } = usePopoverContext();
  const isMcp = useIsMcp();
  const { isRawModeSupported } = useStdin();
  const { focus } = useFocusManager();
  const prevOpenRef = useRef(false);

  // Restore trigger focus on close
  React.useEffect(() => {
    if (open && !prevOpenRef.current) {
      prevOpenRef.current = true;
    }
    if (!open && prevOpenRef.current) {
      focus(triggerFocusId.current);
      prevOpenRef.current = false;
    }
    return undefined;
  }, [open, focus, triggerFocusId]);

  const handleFirstItem = React.useCallback(
    (id: string): void => {
      focus(id);
    },
    [focus],
  );

  const handleClose = useCallback((): void => {
    setOpen(false);
  }, [setOpen]);

  // Esc from anywhere inside content closes popover
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

  // Limit popover height to terminal rows minus chrome
  const termRows = process.stdout.rows || 24;
  const maxHeight = Math.max(termRows - 8, 6);

  return (
    <FocusScopeProvider open={open} onFirstItemReady={handleFirstItem}>
      <Box
        flexDirection="column"
        marginLeft={2}
        marginTop={1}
        borderStyle="single"
        borderColor="cyan"
        paddingX={1}
        height={maxHeight}
        overflowY="hidden"
      >
        {children}
        <PopoverCloseButton onClose={handleClose} />
      </Box>
    </FocusScopeProvider>
  );
}

// ─── PopoverClose ─────────────────────────────────────────────────────────────

export function PopoverClose({
  children,
}: PopoverCloseProps): React.JSX.Element | null {
  const { setOpen } = usePopoverContext();
  const isMcp = useIsMcp();
  const { isRawModeSupported } = useStdin();

  useInput(
    (input, key) => {
      void input;
      if (key.escape || key.return) {
        setOpen(false);
      }
    },
    { isActive: isRawModeSupported && !isMcp },
  );

  if (isMcp) {
    return null;
  }

  return <Text dimColor>{children}</Text>;
}
