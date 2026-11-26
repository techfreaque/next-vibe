"use client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JwtPayloadType } from "next-vibe/identity/auth/types";
import { Button } from "next-vibe/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "next-vibe/ui/components/dialog";
import { Div } from "next-vibe/ui/components/div";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "next-vibe/ui/components/drawer";
import { Span } from "next-vibe/ui/components/span";
import type { JSX } from "react";
import { useState } from "react";

import { scopedTranslation } from "./i18n";
import { getLocaleModel } from "./model";
import { LocalePickerPanel } from "./panel";
import { PickerSurface } from "./shell";
import { useIsPhone } from "./use-is-phone";

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
  const triggerLabel = t("trigger", {
    language: currentLanguage.nativeName,
    region: currentRegion.name,
  });
  return (
    <PickerSurface
      open={open}
      onOpenChange={setOpen}
      title={t("title")}
      description={t("description")}
      desktopClassName="w-[600px] h-[min(70vh,520px)]"
      phoneClassName="h-[88dvh]"
      trigger={
        <Button
          variant="ghost"
          size="unset"
          className="flex h-10 w-10 items-center justify-center"
          aria-label={triggerLabel}
          title={triggerLabel}
        >
          <Span className="my-auto flex items-center justify-center text-lg">
            {currentRegion.flag}
          </Span>
        </Button>
      }
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
          <DrawerDescription className="sr-only">
            {t("description")}
          </DrawerDescription>
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
        <DialogDescription className="sr-only">
          {t("description")}
        </DialogDescription>
        <Div className="flex min-h-0 flex-1 flex-col">{panel}</Div>
      </DialogContent>
    </Dialog>
  );
}
