"use client";

import { Button } from "next-vibe/ui/components/button";
import { LogOut } from "next-vibe/ui/components/icons/LogOut";
import { SectionGroup } from "next-vibe/ui/components/section-group";
import { P } from "next-vibe/ui/components/typography";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetLocale,
  useWidgetLogger,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import { useLogout } from "./hooks";
import { scopedTranslation } from "./i18n";

export function LogoutWidget(): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const logout = useLogout(logger, user);

  return (
    <WidgetShell>
      <SectionGroup title={t("titleShort")}>
        <P className="mb-4 text-sm text-muted-foreground">{t("description")}</P>
        <Button type="button" variant="outline" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
          {t("logoutButton")}
        </Button>
      </SectionGroup>
    </WidgetShell>
  );
}
