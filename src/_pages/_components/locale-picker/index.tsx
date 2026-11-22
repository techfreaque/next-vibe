"use client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "next-vibe/ui/components/dialog";
import { Div } from "next-vibe/ui/components/div";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "next-vibe/ui/components/drawer";
import type { JSX } from "react";
import { useState } from "react";

import { scopedTranslation } from "./i18n";
import { getLocaleModel } from "./model";
import { LocalePickerPanel } from "./panel";
import { flagTrigger, PickerSurface, useIsPhone } from "./shell";

export { getLocaleLabel } from "./model";
export { LocalePickerPanel } from "./panel";

interface LocalePickerProps {
  locale: CountryLanguage;
  user: JwtPayloadType;
}

/**
 * Navbar language + region control: flag-only trigger (full name for screen
 * readers and the tooltip), popover on desktop, bottom sheet on phone.
 */
export function LocalePicker({ locale, user }: LocalePickerProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const { currentLanguage, currentRegion } = getLocaleModel(locale);
  const [open, setOpen] = useState(false);
  return (
    <PickerSurface
      open={open}
      onOpenChange={setOpen}
      title={t("title")}
      desktopClassName="w-[600px] h-[min(70vh,520px)]"
      phoneClassName="h-[88dvh]"
      trigger={flagTrigger({
        flag: currentRegion.flag,
        label: t("trigger", {
          language: currentLanguage.nativeName,
          region: currentRegion.name,
        }),
      })}
    >
      <LocalePickerPanel
        locale={locale}
        user={user}
        onDone={() => setOpen(false)}
      />
    </PickerSurface>
  );
}

interface LocalePickerDialogProps extends LocalePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Settings rows and menus: modal on desktop, bottom sheet on phone. */
export function LocalePickerDialog({
  locale,
  user,
  open,
  onOpenChange,
}: LocalePickerDialogProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  const isPhone = useIsPhone();
  const panel = (
    <LocalePickerPanel
      locale={locale}
      user={user}
      onDone={() => onOpenChange(false)}
    />
  );
  if (isPhone) {
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
        shouldScaleBackground={false}
      >
        <DrawerContent className="flex h-[88dvh] flex-col">
          <DrawerTitle className="px-4 pb-1 pt-3 text-base">
            {t("title")}
          </DrawerTitle>
          <Div className="flex min-h-0 flex-1 flex-col">{panel}</Div>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(72vh,600px)] max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogTitle className="border-b border-border px-5 py-4 text-base">
          {t("title")}
        </DialogTitle>
        <Div className="flex min-h-0 flex-1 flex-col">{panel}</Div>
      </DialogContent>
    </Dialog>
  );
}
