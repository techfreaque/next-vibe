"use client";

import { useTranslation } from "next-vibe/core/i18n/core/client";
import { Div } from "next-vibe/ui/components/div";
import { useWidgetUser } from "next-vibe/unified-ui/_shared/use-widget-context";
import type { FC } from "react";

import { LocalePickerPanel } from "@/_pages/_components/locale-picker";

interface LocaleSelectorContentProps {
  /** Closes the host menu after a pick. */
  onDone?: () => void;
}

const noop = (): void => undefined;

/**
 * The language + region picker inside a dropdown submenu: fixed width so the
 * menu never stretches, bounded height so the region list scrolls.
 */
export const LocaleSelectorContent: FC<LocaleSelectorContentProps> = ({
  onDone = noop,
}) => {
  const { locale } = useTranslation();
  const user = useWidgetUser();
  return (
    <Div className="flex h-[min(70dvh,560px)] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden">
      <LocalePickerPanel locale={locale} user={user} onDone={onDone} />
    </Div>
  );
};
