"use client";

import { Button } from "next-vibe/ui/ui/button";
import { LogOut } from "next-vibe/ui/ui/icons/LogOut";
import { LoadingBlock } from "next-vibe/ui/ui/loading-block";
import { WidgetShell } from "next-vibe/ui/ui/widget-shell";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";
import { useEffect, useRef } from "react";

import { useLogout } from "./hooks";
import { scopedTranslation } from "./i18n";

export function LogoutWidget(): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const logout = useLogout(logger, user);
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!hasTriggered.current) {
      hasTriggered.current = true;
      logout();
    }
  }, [logout]);

  return (
    <WidgetShell>
      <LoadingBlock message={t("loggingOut")} />
      <Button variant="outline" size="sm" onClick={logout} className="gap-2">
        <LogOut className="h-4 w-4" />
        {t("logoutButton")}
      </Button>
    </WidgetShell>
  );
}
