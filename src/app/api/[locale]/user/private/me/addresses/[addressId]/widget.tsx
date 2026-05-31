/**
 * User Address Update/Delete Widget
 * Shows result for PATCH (update) and DELETE operations on a specific address.
 */

"use client";

import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import type { JSX } from "react";

import {
  useWidgetNavigation,
  useWidgetTranslation,
  useWidgetValue,
} from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";

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
    return <Div />;
  }

  return (
    <Div className="space-y-4">
      <Div className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
        {t("update.widget.updated")}
      </Div>
      <Button size="sm" variant="outline" onClick={handleBack}>
        {t("update.widget.backToAddresses")}
      </Button>
    </Div>
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
    return <Div />;
  }

  return (
    <Div className="space-y-4">
      <Div className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
        {t("delete.widget.deleted")}
      </Div>
      <Button size="sm" variant="outline" onClick={handleBack}>
        {t("delete.widget.backToAddresses")}
      </Button>
    </Div>
  );
}
