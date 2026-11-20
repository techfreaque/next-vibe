"use client";

import { DetailField, DetailGrid } from "next-vibe/ui/components/detail-grid";
import { EmptyBlock } from "next-vibe/ui/components/empty-block";
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

export function CurrentLeadReferralWidget(): JSX.Element {
  const t = useWidgetTranslation<typeof GET>();
  const data = useWidgetValue<typeof GET>();
  const response = useWidgetResponse();
  return (
    <WidgetShell>
      <WidgetHeader title={t("titleShort")} />
      <FormAlertWidget field={{}} />
      {!data && !response && <LoadingBlock />}
      {data &&
        (data.referralCode ? (
          <DetailGrid>
            <DetailField
              label={t("response.referralCode")}
              value={data.referralCode}
              mono
            />
            {data.referralLabel && (
              <DetailField
                label={t("response.referralLabel")}
                value={data.referralLabel}
              />
            )}
            <DetailField
              label={t("response.subscriptionBonusCredits")}
              value={data.subscriptionBonusCredits}
            />
          </DetailGrid>
        ) : (
          <EmptyBlock title={t("noReferral")} />
        ))}
    </WidgetShell>
  );
}
