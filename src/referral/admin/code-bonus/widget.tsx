/**
 * Referral Code Bonus - Widget
 * Web: code + bonus credits, then the saved value.
 * CLI/MCP: one summary line.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { Pre } from "next-vibe/ui/components/pre";
import { ResultBanner } from "next-vibe/ui/components/result-banner";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { AdminForm } from "next-vibe/unified-ui/widgets/containers/admin-form/widget";
import { IntFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/int-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type { JSX } from "react";

import type definition from "./definition";
import type { ReferralCodeBonusResponseOutput } from "./definition";

type BonusT = ReturnType<typeof useWidgetTranslation<typeof definition.POST>>;

function summary(result: ReferralCodeBonusResponseOutput, t: BonusT): string {
  return result.subscriptionBonusCredits > 0
    ? t("post.widget.set", {
        code: result.updatedCode,
        owner: result.ownerEmail,
        credits: result.subscriptionBonusCredits,
        previous: result.previousBonusCredits,
      })
    : t("post.widget.cleared", {
        code: result.updatedCode,
        owner: result.ownerEmail,
        previous: result.previousBonusCredits,
      });
}

export function ReferralCodeBonusWidget({
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
    return <Pre>{result ? summary(result, t) : ""}</Pre>;
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
          <ResultBanner variant="success" title={summary(result, t)} />
        ) : undefined
      }
    >
      <Div className="grid grid-cols-1 gap-3 @sm:grid-cols-2">
        <TextFieldWidget
          fieldName="code"
          field={withValue(children.code, undefined, null)}
        />
        <IntFieldWidget
          fieldName="bonusCredits"
          field={withValue(children.bonusCredits, undefined, null)}
        />
      </Div>
    </AdminForm>
  );
}
