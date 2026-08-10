import * as React from "react";

export type {
  MenubarCheckboxItemProps,
  MenubarContentProps,
  MenubarGroupProps,
  MenubarItemProps,
  MenubarLabelProps,
  MenubarMenuProps,
  MenubarPortalProps,
  MenubarRadioGroupProps,
  MenubarRadioItemProps,
  MenubarRootProps,
  MenubarSeparatorProps,
  MenubarShortcutProps,
  MenubarSubContentProps,
  MenubarSubProps,
  MenubarSubTriggerProps,
  MenubarTriggerProps,
} from "../../web/components/menubar";

import type {
  MenubarCheckboxItemProps,
  MenubarGroupProps,
  MenubarItemProps,
  MenubarLabelProps,
  MenubarMenuProps,
  MenubarPortalProps,
  MenubarRadioGroupProps,
  MenubarRadioItemProps,
  MenubarRootProps,
  MenubarShortcutProps,
  MenubarSubProps,
  MenubarSubTriggerProps,
  MenubarTriggerProps,
} from "../../web/components/menubar";

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
