"use client";

import { Button } from "next-vibe/ui/web/ui/button";
import { LoadingBlock } from "next-vibe/ui/web/ui/loading-block";
import { WidgetHeader } from "next-vibe/ui/web/ui/widget-header";
import { WidgetShell } from "next-vibe/ui/web/ui/widget-shell";
import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import type { JSX } from "react";

import type definition from "./definition";

export function UserAddressPatchContainer(): JSX.Element {
  const data = useWidgetValue<typeof definition.PATCH>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.PATCH>();

  const handleBack = (): void => {
    void (async (): Promise<void> => {
      const listDef =
        await import("@/app/api/[locale]/user/private/me/addresses/definition");
      navigation.push(listDef.default.GET, {});
    })();
  };

  if (!data) {
    return <LoadingBlock />;
  }

  return (
    <WidgetShell>
      <WidgetHeader title={t("update.success.title")} />
      <Button size="sm" variant="outline" onClick={handleBack}>
        {t("update.widget.backToAddresses")}
      </Button>
    </WidgetShell>
  );
}

export function UserAddressDeleteContainer(): JSX.Element {
  const data = useWidgetValue<typeof definition.DELETE>();
  const navigation = useWidgetNavigation();
  const t = useWidgetTranslation<typeof definition.DELETE>();

  const handleBack = (): void => {
    void (async (): Promise<void> => {
      const listDef =
        await import("@/app/api/[locale]/user/private/me/addresses/definition");
      navigation.push(listDef.default.GET, {});
    })();
  };

  if (!data) {
    return <LoadingBlock />;
  }

  return (
    <WidgetShell>
      <WidgetHeader title={t("delete.success.title")} />
      <Button size="sm" variant="outline" onClick={handleBack}>
        {t("delete.widget.backToAddresses")}
      </Button>
    </WidgetShell>
  );
}
