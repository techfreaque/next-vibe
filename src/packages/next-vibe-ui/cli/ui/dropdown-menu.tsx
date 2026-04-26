import * as React from "react";

export type {
  DropdownMenuRootProps,
  DropdownMenuTriggerProps,
  DropdownMenuGroupProps,
  DropdownMenuPortalProps,
  DropdownMenuSubProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
} from "../../web/ui/dropdown-menu";

import type {
  DropdownMenuRootProps,
  DropdownMenuTriggerProps,
  DropdownMenuGroupProps,
  DropdownMenuPortalProps,
  DropdownMenuSubProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuShortcutProps,
} from "../../web/ui/dropdown-menu";

export function DropdownMenu({
  children,
}: DropdownMenuRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function DropdownMenuTrigger({
  children,
}: DropdownMenuTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

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

export function DropdownMenuSubContent(): null {
  return null;
}

export function DropdownMenuContent(): null {
  return null;
}

export function DropdownMenuItem({
  children,
}: DropdownMenuItemProps): React.JSX.Element | null {
  return <>{children}</>;
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
  return <>{children}</>;
}

export function DropdownMenuSeparator(): null {
  return null;
}

export function DropdownMenuShortcut({
  children,
}: DropdownMenuShortcutProps): React.JSX.Element | null {
  return <>{children}</>;
}
