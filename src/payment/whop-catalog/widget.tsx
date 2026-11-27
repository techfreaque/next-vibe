/**
 * Whop Catalog Sync - Widget
 * Web: dry-run toggle, counts, one row per variant.
 * CLI/MCP: summary line plus one line per variant (key -> variant id).
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { MetricCard } from "next-vibe/ui/components/metric-card";
import { MetricGrid } from "next-vibe/ui/components/metric-grid";
import { Pre } from "next-vibe/ui/components/pre";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { BooleanFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/boolean-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";
import type { WhopCatalogSyncResponseOutput } from "./definition";

type CatalogT = ReturnType<typeof useWidgetTranslation<typeof definition.POST>>;

function reportLines(
  result: WhopCatalogSyncResponseOutput,
  t: CatalogT,
): string {
  return [
    t("post.widget.summary", {
      environment: result.environment,
      accountId: result.accountId,
      existing: result.existing,
      created: result.created,
      missing: result.missing,
    }),
    ...result.variants.map(
      (row) =>
        `${row.status.padEnd(8)} ${row.key}  ${row.amount}  ${row.variantId || "-"}`,
    ),
  ].join("\n");
}

export function WhopCatalogWidget({
  field,
}: {
  field: (typeof definition.POST)["fields"];
}): JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const platform = useWidgetPlatform();
  const responseOnly = useWidgetResponseOnly();
  const result = useWidgetValue<typeof definition.POST>();
  const children = field.children;

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return <Pre>{result ? reportLines(result, t) : ""}</Pre>;
  }

  return (
    <AdminForm
      title={t("post.title")}
      description={t("post.widget.hint")}
      primaryAction={
        <SubmitButtonWidget<typeof definition.POST>
          field={{ text: "post.widget.submit" }}
        />
      }
      result={
        result ? (
          <Div className="flex flex-col gap-3">
            <MetricGrid columns={3}>
              <MetricCard
                label={t("post.response.existing")}
                value={result.existing}
                variant="muted"
              />
              <MetricCard
                label={t("post.response.created")}
                value={result.created}
                variant="success"
              />
              <MetricCard
                label={t("post.response.missing")}
                value={result.missing}
                variant="info"
              />
            </MetricGrid>
            <Pre>{reportLines(result, t)}</Pre>
          </Div>
        ) : undefined
      }
    >
      <BooleanFieldWidget
        fieldName="dryRun"
        field={withValue(children.dryRun, undefined, null)}
      />
    </AdminForm>
  );
}
