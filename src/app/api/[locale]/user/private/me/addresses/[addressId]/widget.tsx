"use client";

import { Button } from "next-vibe-ui/ui/button";
import { LoadingBlock } from "next-vibe-ui/ui/loading-block";
import { WidgetShell } from "next-vibe-ui/ui/widget-shell";
import { WidgetHeader } from "next-vibe-ui/ui/widget-header";
import type { JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe-ui/unified/_shared/use-widget-context";

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
