/**
 * Newsletter Credit Bonus Widget
 *
 * GET: one line on where the account's newsletter bonus stands + refill date.
 * POST: the same line after claiming, with the claim button while nothing is
 * claimed yet. Web, CLI and MCP share the compact layout. The chat's
 * out-of-credits card uses hooks.ts directly instead.
 */

"use client";

import { Methods } from "next-vibe/core/definition/enums";
import { Div } from "next-vibe/ui/components/div";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { P } from "next-vibe/ui/components/typography";
import {
  useWidgetEndpoint,
  useWidgetLocale,
  useWidgetTranslation,
  useWidgetValue,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { SubmitButtonWidget } from "next-vibe/unified-ui/widgets/interactive/submit-button/widget";
import type React from "react";

import type definition from "./definition";
import { NewsletterCreditOffer } from "./enum";

interface NewsletterCreditBonusWidgetProps {
  field: (typeof definition.POST)["fields"];
}

export function NewsletterCreditBonusWidget(
  // oxlint-disable-next-line no-unused-vars -- widget contract: the framework passes the field
  _props: NewsletterCreditBonusWidgetProps,
): React.JSX.Element {
  const t = useWidgetTranslation<typeof definition.POST>();
  const locale = useWidgetLocale();
  const data = useWidgetValue<typeof definition.POST>();
  const endpoint = useWidgetEndpoint<typeof definition.POST>();
  const isPost = endpoint?.method === Methods.POST;

  const status = ((): string | null => {
    if (!data) {
      return null;
    }
    const params = { bonusCredits: data.bonusCredits, email: data.email };
    switch (data.offer) {
      case NewsletterCreditOffer.AVAILABLE:
        return `${t("widget.available", params)}. ${t("widget.availableHint", params)}`;
      case NewsletterCreditOffer.PENDING_CONFIRMATION:
        return t("widget.pending", params);
      case NewsletterCreditOffer.ACTIVE:
        return t("widget.active", params);
      case NewsletterCreditOffer.NOT_ELIGIBLE:
        return t("widget.notEligible");
    }
  })();

  const refill = data
    ? t("widget.refill", {
        date: new Date(data.freeRefillAt).toLocaleDateString(locale, {
          month: "long",
          day: "numeric",
        }),
      })
    : null;

  return (
    <Div className="flex flex-col gap-2">
      <FormAlertWidget field={{}} />
      {status && (
        <Div className="flex items-start gap-2">
          <Gift className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
          <P className="m-0 text-sm text-foreground">{status}</P>
        </Div>
      )}
      {refill && <P className="m-0 text-xs text-muted-foreground">{refill}</P>}
      {isPost && (!data || data.offer === NewsletterCreditOffer.AVAILABLE) && (
        <SubmitButtonWidget<typeof definition.POST>
          field={{
            text: "post.titleShort",
            loadingText: "post.titleShort",
            icon: "gift",
          }}
        />
      )}
    </Div>
  );
}
