/**
 * CLI AlertDialog
 *
 * Respects open/onOpenChange props. ESC closes the dialog.
 * Action and Cancel are focusable buttons.
 */
import { Box, Text, useFocus, useInput, useStdin } from "ink";
import * as React from "react";
import { useRef } from "react";

export type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogOverlayProps,
  AlertDialogPortalProps,
  AlertDialogRootProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
} from "next-vibe/ui/web/ui/alert-dialog";

import type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogHeaderProps,
  AlertDialogPortalProps,
  AlertDialogRootProps,
  AlertDialogTitleProps,
  AlertDialogTriggerProps,
} from "next-vibe/ui/web/ui/alert-dialog";
import { useIsMcp } from "next-vibe/unified-ui/_shared/use-widget-context";

let alertBtnIdCounter = 0;

export function AlertDialog({
  children,
  open,
  onOpenChange,
}: AlertDialogRootProps): React.JSX.Element | null {
  const isMcp = useIsMcp();
  const { isRawModeSupported } = useStdin();

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
  return <>{children}</>;
}

export function AlertDialogTrigger({
  children,
}: AlertDialogTriggerProps): React.JSX.Element | null {
  return <Text>{children}</Text>;
}

export function AlertDialogPortal({
  children,
}: AlertDialogPortalProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function AlertDialogOverlay(): null {
  return null;
}

export function AlertDialogContent({
  children,
}: AlertDialogContentProps): React.JSX.Element | null {
  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor="yellow"
      paddingX={1}
      paddingY={1}
    >
      {children}
    </Box>
  );
}

export function AlertDialogHeader({
  children,
}: AlertDialogHeaderProps): React.JSX.Element | null {
  return (
    <Box flexDirection="column" marginBottom={1}>
      {children}
    </Box>
  );
}

export function AlertDialogFooter({
  children,
}: AlertDialogFooterProps): React.JSX.Element | null {
  return (
    <Box marginTop={1} gap={1}>
      {children}
    </Box>
  );
}

export function AlertDialogTitle({
  children,
}: AlertDialogTitleProps): React.JSX.Element | null {
  return <Text bold>{children}</Text>;
}

export function AlertDialogDescription({
  children,
}: AlertDialogDescriptionProps): React.JSX.Element | null {
  return <Text dimColor>{children}</Text>;
}

export function AlertDialogAction({
  children,
  onClick,
}: AlertDialogActionProps): React.JSX.Element | null {
  const isMcp = useIsMcp();
  const { isRawModeSupported } = useStdin();
  const idRef = useRef(`alert-act-${(alertBtnIdCounter++).toString()}`);

  const { isFocused } = useFocus({ id: idRef.current, autoFocus: false });

  useInput(
    (input, key) => {
      if ((key.return || input === " ") && onClick) {
        onClick();
      }
    },
    { isActive: isRawModeSupported && !isMcp && isFocused },
  );

  if (isMcp) {
    return null;
  }

  return (
    <Text color={isFocused ? "red" : undefined} bold={isFocused}>
      [{children}]
    </Text>
  );
}

export function AlertDialogCancel({
  children,
  onClick,
}: AlertDialogCancelProps): React.JSX.Element | null {
  const isMcp = useIsMcp();
  const { isRawModeSupported } = useStdin();
  const idRef = useRef(`alert-cancel-${(alertBtnIdCounter++).toString()}`);

  const { isFocused } = useFocus({ id: idRef.current, autoFocus: false });

  useInput(
    (input, key) => {
      if ((key.return || input === " ") && onClick) {
        onClick();
      }
    },
    { isActive: isRawModeSupported && !isMcp && isFocused },
  );

  if (isMcp) {
    return null;
  }

  return (
    <Text dimColor={!isFocused} color={isFocused ? "cyan" : undefined}>
      [{children}]
    </Text>
  );
}
