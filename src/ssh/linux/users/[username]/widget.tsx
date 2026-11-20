"use client";

import { Button } from "next-vibe/ui/components/button";
import { P } from "next-vibe/ui/components/typography";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetIsInteractive,
  useWidgetLocale,
  useWidgetNavigation,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import { scopedTranslation as directoryTranslation } from "../list/i18n";
import type definition from "./definition";

export function LinuxUserDeleteContainer(): JSX.Element {
  const t = useWidgetTranslation<typeof definition.DELETE>();
  const { t: directory } = directoryTranslation.scopedT(useWidgetLocale());
  const data = useWidgetValue<typeof definition.DELETE>();
  const navigation = useWidgetNavigation();
  const interactive = useWidgetIsInteractive();
  const responseOnly = useWidgetResponseOnly();

  return (
    <WidgetShell>
      <WidgetHeader title={t("delete.title")} />
      <FormAlertWidget field={{}} />
      <P>{data?.ok ? t("delete.success.title") : t("delete.review")}</P>
      {interactive && !responseOnly && (
        <Button
          variant="outline"
          type="button"
          onClick={async () => {
            const list = await import("../list/definition");
            navigation.push(list.default.GET, {});
          }}
        >
          {directory("get.title")}
        </Button>
      )}
    </WidgetShell>
  );
}
