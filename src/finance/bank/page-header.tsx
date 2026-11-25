"use client";

import { Button } from "next-vibe/ui/components/button";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import {
  useWidgetLocale,
  useWidgetNavigation,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX, ReactNode } from "react";

import { scopedTranslation } from "./i18n";

export function BankPageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}): JSX.Element {
  const { canGoBack, pop } = useWidgetNavigation();
  const { t } = scopedTranslation.scopedT(useWidgetLocale());
  return (
    <WidgetHeader
      size="page"
      title={title}
      subtitle={subtitle}
      actions={actions}
      backButton={
        canGoBack ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => pop()}>
            <ChevronLeft className="h-4 w-4" />
            {t("ui.back")}
          </Button>
        ) : undefined
      }
    />
  );
}
