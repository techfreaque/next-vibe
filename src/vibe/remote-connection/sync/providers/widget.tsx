"use client";

import { EmptyBlock } from "next-vibe/ui/components/empty-block";
import { ListItem } from "next-vibe/ui/components/list-item";
import { LoadingBlock } from "next-vibe/ui/components/loading-block";
import { WidgetHeader } from "next-vibe/ui/components/widget-header";
import { WidgetShell } from "next-vibe/ui/components/widget-shell";
import {
  useWidgetResponse,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import type { JSX } from "react";

import type { GET } from "./definition";

export function SyncProvidersWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof GET>();
  const data = useWidgetValue<typeof GET>();
  const response = useWidgetResponse();
  return (
    <WidgetShell>
      <WidgetHeader title={t("get.title")} />
      <FormAlertWidget field={{}} />
      {!data && !response && <LoadingBlock />}
      {data?.providers.length === 0 && (
        <EmptyBlock title={t("get.errors.notFound.description")} />
      )}
      {data?.providers.map((provider) => (
        <ListItem
          key={provider.key}
          title={provider.label}
          subtitle={provider.description}
          meta={provider.key}
        />
      ))}
    </WidgetShell>
  );
}
