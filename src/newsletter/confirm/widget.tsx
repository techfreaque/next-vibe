/**
 * Newsletter Confirm Widget
 *
 * Double opt-in landing: the welcome email deep-links /story/newsletter/confirm/[token],
 * which mounts this widget via EndpointsPage with the token prefilled. One button
 * confirms - an explicit click, so mail scanners that prefetch links do not confirm.
 * CLI/MCP get the bare form and a one-line result.
 */

"use client";

import { FREE_CREDIT_ALLOWANCE } from "@/products/constants";
import { Platform } from "next-vibe/platforms/platforms";
import { Div } from "next-vibe/ui/components/div";
import { CheckCircle } from "next-vibe/ui/components/icons/CheckCircle";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { Link } from "next-vibe/ui/components/link";
import { Span } from "next-vibe/ui/components/span";
import { H1, P } from "next-vibe/ui/components/typography";
import {
  useWidgetForm,
  useWidgetLocale,
  useWidgetPlatform,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { TextFieldWidget } from "next-vibe/unified-ui/widgets/form-fields/text-field/widget";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type React from "react";

import type definition from "./definition";

interface NewsletterConfirmWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function NewsletterConfirmWidget({
  field,
}: NewsletterConfirmWidgetProps): React.JSX.Element {
  const children = field.children;
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const platform = useWidgetPlatform();
  const isCli = platform === Platform.CLI || platform === Platform.MCP;
  const form = useWidgetForm<typeof definition.POST>();
  const data = useWidgetValue<typeof definition.POST>();

  const bonusCredits =
    data?.bonusCredits ?? FREE_CREDIT_ALLOWANCE.newsletterBonus;
  // Deep link seeds the token - hide the raw code; shown for manual paste only
  const hasPrefilledToken = Boolean(form?.formState.defaultValues?.token);

  const submitButton = (
    <SubmitButtonWidget<typeof definition.POST>
      field={{
        text: "widget.confirmButton",
        loadingText: "widget.confirming",
        icon: "mail",
        size: isCli ? "default" : "lg",
      }}
    />
  );

  if (isCli) {
    if (data?.confirmed) {
      return (
        <Div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          <Span className="font-semibold">
            {t("widget.confirmedTitle", { bonusCredits })}
          </Span>
        </Div>
      );
    }
    return (
      <Div className="flex flex-col gap-2">
        <FormAlertWidget field={{}} />
        <TextFieldWidget fieldName="token" field={children.token} />
        {submitButton}
      </Div>
    );
  }

  return (
    <Div className="min-h-screen bg-background">
      <Div className="border-b border-border bg-linear-to-b from-primary/[0.05] to-background">
        <Div className="mx-auto w-full max-w-xl px-4 pt-12 pb-16 sm:px-6 md:pt-20 md:pb-24">
          {data?.confirmed ? (
            <Div className="flex flex-col items-start gap-4">
              <CheckCircle className="h-10 w-10 text-success" />
              <H1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                {t("widget.confirmedTitle", { bonusCredits })}
              </H1>
              <P className="text-lg leading-relaxed text-pretty text-muted-foreground">
                {t("widget.confirmedDescription")}
              </P>
              <Link
                href={`/${locale}/threads`}
                className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 font-medium text-primary-foreground"
              >
                {t("widget.startChatting")}
              </Link>
            </Div>
          ) : (
            <>
              <Gift className="h-10 w-10 text-primary" />
              <H1 className="mt-4 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                {t("widget.heroTitle", { bonusCredits })}
              </H1>
              <P className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
                {t("widget.heroDescription")}
              </P>
              <Div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                <FormAlertWidget field={{}} />
                {/* Prefilled from the deep link: keep the field mounted (it is the
                    form's value) but out of sight - nobody needs to read the code */}
                <Div className={hasPrefilledToken ? "hidden" : undefined}>
                  <TextFieldWidget fieldName="token" field={children.token} />
                </Div>
                {submitButton}
              </Div>
            </>
          )}
        </Div>
      </Div>
    </Div>
  );
}
