import * as React from "react";

export type {
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  ContextMenuGroupProps,
  ContextMenuPortalProps,
  ContextMenuSubProps,
  ContextMenuRadioGroupProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioItemProps,
  ContextMenuLabelProps,
  ContextMenuSeparatorProps,
  ContextMenuShortcutProps,
} from "../../web/ui/context-menu";

import type {
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  ContextMenuGroupProps,
  ContextMenuPortalProps,
  ContextMenuSubProps,
  ContextMenuRadioGroupProps,
  ContextMenuSubTriggerProps,
  ContextMenuItemProps,
  ContextMenuCheckboxItemProps,
  ContextMenuRadioItemProps,
  ContextMenuLabelProps,
  ContextMenuShortcutProps,
} from "../../web/ui/context-menu";

export function ContextMenu({
  children,
}: ContextMenuRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ContextMenuTrigger({
  children,
}: ContextMenuTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ContextMenuGroup({
  children,
}: ContextMenuGroupProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ContextMenuPortal({
  children,
}: ContextMenuPortalProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ContextMenuSub({
  children,
}: ContextMenuSubProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ContextMenuRadioGroup({
  children,
}: ContextMenuRadioGroupProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ContextMenuSubTrigger({
  children,
}: ContextMenuSubTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ContextMenuSubContent(): null {
  return null;
}

export function ContextMenuContent(): null {
  return null;
}

export function ContextMenuItem({
  children,
}: ContextMenuItemProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ContextMenuCheckboxItem({
  children,
}: ContextMenuCheckboxItemProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ContextMenuRadioItem({
  children,
}: ContextMenuRadioItemProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ContextMenuLabel({
  children,
}: ContextMenuLabelProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function ContextMenuSeparator(): null {
  return null;
}

export function ContextMenuShortcut({
  children,
}: ContextMenuShortcutProps): React.JSX.Element | null {
  return <>{children}</>;
}
