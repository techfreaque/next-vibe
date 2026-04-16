import * as React from "react";

export type {
  MenubarRootProps,
  MenubarMenuProps,
  MenubarTriggerProps,
  MenubarGroupProps,
  MenubarPortalProps,
  MenubarSubProps,
  MenubarRadioGroupProps,
  MenubarSubTriggerProps,
  MenubarSubContentProps,
  MenubarContentProps,
  MenubarItemProps,
  MenubarCheckboxItemProps,
  MenubarRadioItemProps,
  MenubarLabelProps,
  MenubarSeparatorProps,
  MenubarShortcutProps,
} from "../../web/ui/menubar";

import type {
  MenubarRootProps,
  MenubarMenuProps,
  MenubarTriggerProps,
  MenubarGroupProps,
  MenubarPortalProps,
  MenubarSubProps,
  MenubarRadioGroupProps,
  MenubarSubTriggerProps,
  MenubarItemProps,
  MenubarCheckboxItemProps,
  MenubarRadioItemProps,
  MenubarLabelProps,
  MenubarShortcutProps,
} from "../../web/ui/menubar";

export function Menubar({
  children,
}: MenubarRootProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MenubarMenu({
  children,
}: MenubarMenuProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MenubarTrigger({
  children,
}: MenubarTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MenubarGroup({
  children,
}: MenubarGroupProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MenubarPortal({
  children,
}: MenubarPortalProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MenubarSub({
  children,
}: MenubarSubProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MenubarRadioGroup({
  children,
}: MenubarRadioGroupProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MenubarSubTrigger({
  children,
}: MenubarSubTriggerProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MenubarSubContent(): null {
  return null;
}

export function MenubarContent(): null {
  return null;
}

export function MenubarItem({
  children,
}: MenubarItemProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MenubarCheckboxItem({
  children,
}: MenubarCheckboxItemProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MenubarRadioItem({
  children,
}: MenubarRadioItemProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MenubarLabel({
  children,
}: MenubarLabelProps): React.JSX.Element | null {
  return <>{children}</>;
}

export function MenubarSeparator(): null {
  return null;
}

export function MenubarShortcut({
  children,
}: MenubarShortcutProps): React.JSX.Element | null {
  return <>{children}</>;
}
