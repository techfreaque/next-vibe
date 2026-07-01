/* eslint-disable oxlint-plugin-i18n/no-literal-string */
/**
 * CLI Dialog
 *
 * Respects open/onOpenChange props. ESC closes the dialog.
 * Content renders inline with a border, height-limited to terminal rows.
 * Saves/restores focus on open/close.
 *
 * Provides an overlay lock: while any dialog is open, buttons suppress
 * their Enter/Space handlers to prevent the wrong action from firing.
 *
 * Provides a focus scope with focus trapping: focusable children register
 * their IDs so the dialog can auto-focus the first item on open and keep
 * Tab/Shift+Tab cycling within the scope.
 */
import process from "node:process";

import { Box, Text, useFocus, useFocusManager, useInput, useStdin } from "ink";
import * as React from "react";

export type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogOverlayProps,
  DialogPortalProps,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "next-vibe/ui/web/ui/dialog";

import type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogPortalProps,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "next-vibe/ui/web/ui/dialog";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";

// ─── Overlay Lock ────────────────────────────────────────────────────────────
// Module-level overlay counter with subscriber notification.
// When a dialog/popover opens, all focusable components outside the overlay's
// focus scope deactivate themselves (like web's `inert` attribute).

let overlayCount = 0;
const overlayListeners = new Set<() => void>();

function notifyOverlayListeners(): void {
  for (const listener of overlayListeners) {
    listener();
  }
}

/** Returns true when any dialog or popover overlay is currently open. */
export function isOverlayOpen(): boolean {
  return overlayCount > 0;
}

/** Subscribe to overlay count changes. Returns unsubscribe function. */
function subscribeOverlay(listener: () => void): () => void {
  overlayListeners.add(listener);
  return (): void => {
    overlayListeners.delete(listener);
  };
}

function getOverlaySnapshot(): number {
  return overlayCount;
}

/**
 * React hook that re-renders when the overlay count changes.
 * Returns current overlay count.
 */
function useOverlayCount(): number {
  return React.useSyncExternalStore(subscribeOverlay, getOverlaySnapshot);
}

/** Increment/decrement the overlay counter. Used by Dialog and Popover. */
export function useOverlayLock(active: boolean): void {
  React.useEffect((): (() => void) | undefined => {
    if (active) {
      overlayCount++;
      notifyOverlayListeners();
      return (): void => {
        overlayCount--;
        notifyOverlayListeners();
      };
    }
    return undefined;
  }, [active]);
}

// ─── Focus Scope ─────────────────────────────────────────────────────────────
// Shared context for Dialog and Popover. Focusable children register their
// Ink focus IDs here so the container can auto-focus the first item on open.

interface FocusScopeContextType {
  /** Register a focusable ID. Returns cleanup function. */
  register: (id: string) => () => void;
  /** Ref holding all registered IDs in mount order. */
  itemIds: React.MutableRefObject<string[]>;
}

const FocusScopeContext = React.createContext<FocusScopeContextType | null>(
  null,
);

/** Hook for focusable components to register with the nearest focus scope. */
export function useFocusScopeRegister(id: string): void {
  const scope = React.useContext(FocusScopeContext);
  React.useEffect((): (() => void) | undefined => {
    if (!scope) {
      return undefined;
    }
    return scope.register(id);
  }, [scope, id]);
}

/** Returns true when the component is inside an active FocusScopeProvider (Dialog/Popover). */
export function useIsInFocusScope(): boolean {
  return React.useContext(FocusScopeContext) !== null;
}

/**
 * Returns whether this focusable should be active in Ink's focus system.
 * When an overlay (Dialog/Popover) is open, only elements inside its
 * focus scope remain active — elements outside are deactivated so Tab
 * never reaches them. This mirrors web's inert/aria-hidden behavior.
 */
export function useShouldFocus(): boolean {
  const inScope = React.useContext(FocusScopeContext) !== null;
  const count = useOverlayCount();
  // If an overlay is open and we're NOT inside its focus scope, deactivate
  if (count > 0 && !inScope) {
    return false;
  }
  return true;
}

/**
 * Provider that collects child focus IDs and traps Tab/Shift+Tab within scope.
 * Used by DialogContent / PopoverContent.
 *
 * Focus trapping: when open with registered items, Tab wraps from last→first
 * and Shift+Tab wraps from first→last. This prevents focus from escaping the
 * overlay to unrelated global focusables.
 */
export function FocusScopeProvider({
  children,
  open,
  onFirstItemReady,
}: {
  children: React.ReactNode;
  open: boolean;
  onFirstItemReady: (id: string) => void;
}): React.JSX.Element {
  const itemIdsRef = React.useRef<string[]>([]);
  const firedRef = React.useRef(false);
  const onFirstItemReadyRef = React.useRef(onFirstItemReady);
  onFirstItemReadyRef.current = onFirstItemReady;
  const { isRawModeSupported } = useStdin();
  const { focus, activeId } = useFocusManager();
  const activeIdRef = React.useRef(activeId);
  activeIdRef.current = activeId;
  // State flag to trigger re-render when first item registers, enabling useInput
  const [hasItems, setHasItems] = React.useState(false);

  // Reset when closed
  React.useEffect((): void => {
    if (!open) {
      itemIdsRef.current = [];
      firedRef.current = false;
      setHasItems(false);
    }
  }, [open]);

  const register = React.useCallback((id: string): (() => void) => {
    const ids = itemIdsRef.current;
    if (!ids.includes(id)) {
      ids.push(id);
    }
    // Flip state so useInput's isActive re-evaluates
    setHasItems(true);
    // Auto-focus the first item once it registers.
    // Use 50ms delay so React has time to process Ink's addFocusable state
    // update from useFocus before we call focus(id).
    if (!firedRef.current && ids.length > 0) {
      firedRef.current = true;
      setTimeout((): void => {
        const firstId = itemIdsRef.current[0];
        if (firstId) {
          onFirstItemReadyRef.current(firstId);
        }
      }, 50);
    }
    return (): void => {
      const idx = ids.indexOf(id);
      if (idx !== -1) {
        ids.splice(idx, 1);
      }
      if (ids.length === 0) {
        setHasItems(false);
      }
    };
  }, []);

  // Focus trapping: intercept Tab/Shift+Tab to cycle within registered items.
  // Ink's built-in Tab handler (focusNext/focusPrevious) runs first on the same
  // event and moves focus to the next global focusable. Our handler runs after
  // and overrides focus back to the correct scoped item via focus(id).
  // Both calls batch into the same React update, so the final activeId is ours.
  useInput(
    (input, key) => {
      void input;
      const ids = itemIdsRef.current;
      if (!key.tab || ids.length === 0) {
        return;
      }
      const currentId = activeIdRef.current;
      const currentIdx = currentId ? ids.indexOf(currentId) : -1;
      if (key.shift) {
        // Shift+Tab: move backward, wrap to last
        const prevIdx = currentIdx <= 0 ? ids.length - 1 : currentIdx - 1;
        const prevId = ids[prevIdx];
        if (prevId) {
          focus(prevId);
        }
      } else {
        // Tab: move forward, wrap to first
        const nextIdx = currentIdx >= ids.length - 1 ? 0 : currentIdx + 1;
        const nextId = ids[nextIdx];
        if (nextId) {
          focus(nextId);
        }
      }
    },
    { isActive: isRawModeSupported && open && hasItems },
  );

  const ctx = React.useMemo(
    (): FocusScopeContextType => ({ register, itemIds: itemIdsRef }),
    [register],
  );

  return (
    <FocusScopeContext.Provider value={ctx}>
      {children}
    </FocusScopeContext.Provider>
  );
}

// ─── Dialog Context ──────────────────────────────────────────────────────────
// Passes close callback from Dialog root to DialogContent so it can render
// a close button and handle Escape.

interface DialogContextType {
  close: () => void;
}

const DialogContext = React.createContext<DialogContextType | null>(null);

// ─── Dialog ──────────────────────────────────────────────────────────────────

export function Dialog({
  children,
  open,
  onOpenChange,
}: DialogRootProps): React.JSX.Element | null {
  const isMcp = useIsMcp();
  const { isRawModeSupported } = useStdin();
  const { activeId, focus } = useFocusManager();
  const savedFocusIdRef = React.useRef<string | undefined>(undefined);
  const prevOpenRef = React.useRef(false);

  // Register this dialog as an active overlay
  useOverlayLock(open === true);

  // Track activeId in a ref so we capture it on open without re-running
  const activeIdRef = React.useRef(activeId);
  activeIdRef.current = activeId;

  const closeFn = React.useCallback((): void => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  }, [onOpenChange]);

  // Save focus on open, restore on close
  React.useEffect(() => {
    if (open && !prevOpenRef.current) {
      savedFocusIdRef.current = activeIdRef.current;
      prevOpenRef.current = true;
    }
    if (!open && prevOpenRef.current) {
      if (savedFocusIdRef.current) {
        focus(savedFocusIdRef.current);
      }
      prevOpenRef.current = false;
    }
    return undefined;
  }, [open, focus]);

  useInput(
    (input, key) => {
      void input;
      if (key.escape && onOpenChange) {
        onOpenChange(false);
      }
    },
    { isActive: isRawModeSupported && !isMcp && open === true },
  );

  if (open === false) {
    return null;
  }
  return (
    <DialogContext.Provider value={{ close: closeFn }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
}: DialogTriggerProps): React.JSX.Element | null {
  return <Text>{children}</Text>;
}

export function DialogPortal({
  children,
}: DialogPortalProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DialogClose({
  children,
}: DialogCloseProps): React.JSX.Element | null {
  return <Text>{children}</Text>;
}

export function DialogOverlay(): null {
  return null;
}

let dialogCloseIdCounter = 0;

/**
 * Inline close button for DialogContent. Uses useFocus/useInput directly
 * to avoid circular dependency with Button (which imports from dialog).
 * Registers with FocusScopeProvider so focus trapping works even in
 * text-only dialogs.
 */
function DialogCloseButton({
  onClose,
}: {
  onClose: () => void;
}): React.JSX.Element {
  const idRef = React.useRef(
    `dlg-close-${(dialogCloseIdCounter++).toString()}`,
  );
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

export function DialogContent({
  children,
}: DialogContentProps): React.JSX.Element | null {
  const { focus } = useFocusManager();
  const dialogCtx = React.useContext(DialogContext);
  // Limit dialog height to terminal rows minus chrome (border + padding + surrounding UI)
  const termRows = process.stdout.rows || 24;
  const maxHeight = Math.max(termRows - 6, 8);

  const handleFirstItem = React.useCallback(
    (id: string): void => {
      focus(id);
    },
    [focus],
  );

  const handleClose = React.useCallback((): void => {
    dialogCtx?.close();
  }, [dialogCtx]);

  return (
    <FocusScopeProvider open onFirstItemReady={handleFirstItem}>
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="yellow"
        paddingX={1}
        paddingY={1}
        height={maxHeight}
        overflowY="hidden"
      >
        {children}
        <DialogCloseButton onClose={handleClose} />
      </Box>
    </FocusScopeProvider>
  );
}

export function DialogHeader({
  children,
}: DialogHeaderProps): React.JSX.Element | null {
  return (
    <Box flexDirection="column" marginBottom={1}>
      {children}
    </Box>
  );
}

export function DialogFooter({
  children,
}: DialogFooterProps): React.JSX.Element | null {
  return (
    <Box marginTop={1} gap={1}>
      {children}
    </Box>
  );
}

export function DialogTitle({
  children,
}: DialogTitleProps): React.JSX.Element | null {
  return <Text bold>{children}</Text>;
}

export function DialogDescription({
  children,
}: DialogDescriptionProps): React.JSX.Element | null {
  return <Text dimColor>{children}</Text>;
}
