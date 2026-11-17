/**
 * Referral Code Bonus - Widget
 * Web: code + bonus credits, then the saved value.
 * CLI/MCP: one summary line.
 */

"use client";

import { isCliPlatform, Platform } from "next-vibe/platforms/platforms";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { ChevronLeft } from "next-vibe/ui/components/icons/ChevronLeft";
import { Pre } from "next-vibe/ui/components/pre";
import { P } from "next-vibe/ui/components/typography";
import { withValue } from "next-vibe/unified-ui/_shared/field-helpers";
import {
  useWidgetNavigation,
  useWidgetPlatform,
  useWidgetResponseOnly,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { IntFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/int-field/widget";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
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
  const { pop, canGoBack } = useWidgetNavigation();
  const children = field.children;

  if (responseOnly && (isCliPlatform(platform) || platform === Platform.MCP)) {
    return <Pre>{result ? summary(result, t) : ""}</Pre>;
  }

  return (
    <Div className="max-w-2xl mx-auto w-full px-4 pt-6 pb-6 flex flex-col gap-4">
      {canGoBack && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => pop()}
          className="self-start gap-1.5 -ml-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t("post.widget.back")}
        </Button>
      )}
      <P className="text-sm text-muted-foreground">{t("post.widget.hint")}</P>
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
      <FormAlertWidget field={{}} />
      {result && <P className="text-sm font-medium">{summary(result, t)}</P>}
      <SubmitButtonWidget<typeof definition.POST>
        field={{ text: "post.widget.submit" as const }}
      />
    </Div>
  );
}
