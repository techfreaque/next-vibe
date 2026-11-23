"use client";

import { OutOfCreditsCard } from "next-vibe/agent/ai-stream/stream/widget/out-of-credits-card";
import { toStudioSettings } from "next-vibe/agent/media-studio/settings";
import { isUncensoredContent } from "next-vibe/agent/models/uncensored-consent/constants";
import { useUncensoredConsent } from "next-vibe/agent/models/uncensored-consent/hooks";
import { UncensoredConsentDialog } from "next-vibe/agent/models/uncensored-consent/widget/consent-dialog";
import { ErrorResponseTypes } from "next-vibe/core/route/response.schema";
import { Button, buttonVariants } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Gift } from "next-vibe/ui/components/icons/Gift";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Label } from "next-vibe/ui/components/label";
import { Link } from "next-vibe/ui/components/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import { cn } from "next-vibe/unified-ui/_shared/cn";
import {
  useWidgetForm,
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetResponse,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, type ReactNode, useEffect, useId, useState } from "react";

import { creditPolicyReason } from "@/credits/anti-farming/reason";
import {
  formatCreditAmount,
  formatCreditsAsMoney,
} from "@/products/credit-money";
import { getPricingParams } from "@/products/repository-client";
import { authPageHref } from "@/user/public/login/callback-url";

import { scopedTranslation } from "../i18n";
import { createHref, type CreateKind, rerunHref } from "./create-kinds";
import { refreshStudioHistory } from "./studio-history";
import { STUDIO_ICONS } from "./studio-shell";
import type { StudioModel } from "./studio-types";

export function StudioSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | undefined;
  options: { value: T; label: string; price?: string }[];
  onChange: (value: T) => void;
}): JSX.Element | null {
  const id = useId();
  const submitting = useWidgetIsSubmitting();
  const { t } = scopedTranslation.scopedT(useWidgetLocale());
  const selected = options.find((item) => item.value === value);
  if (!options.length) {
    return null;
  }
  return (
    <Div className="flex min-w-0 flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={submitting}>
        <SelectTrigger
          id={id}
          className="h-auto min-h-11 w-full gap-2 rounded-lg text-left"
        >
          <Div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <Span className="whitespace-normal font-medium">
              {selected?.label ?? t("modelDefault")}
            </Span>
            {selected?.price && (
              <Span className="whitespace-normal text-xs text-muted-foreground">
                {selected.price}
              </Span>
            )}
          </Div>
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="max-h-72 max-w-[calc(100vw-2rem)]"
        >
          {options.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.price ? `${item.label} · ${item.price}` : item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Div>
  );
}

/**
 * Guest without enough free credits: what a free account gives, then sign up
 * or log in and land back here with the same settings.
 */
function GuestCredits({
  kind,
  cost,
}: {
  kind: CreateKind;
  cost: number | undefined;
}): JSX.Element {
  const locale = useWidgetLocale();
  const form = useWidgetForm();
  const { t } = scopedTranslation.scopedT(locale);
  const pricing = getPricingParams(locale);
  const back =
    kind === "transcribe" || !form
      ? createHref(locale, kind)
      : rerunHref(locale, kind, toStudioSettings(form.getValues()));
  return (
    <Div
      data-testid="out-of-credits-card"
      className="flex flex-col gap-3 rounded-xl border bg-muted/40 p-4"
    >
      <Div className="flex items-start gap-3">
        <Span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Gift className="size-4" />
        </Span>
        <Div className="flex min-w-0 flex-col gap-1">
          <P className="m-0 text-sm font-semibold">{t("ooc.title")}</P>
          <P className="m-0 text-sm leading-relaxed text-muted-foreground">
            {cost !== undefined
              ? t("ooc.need", { amount: formatCreditAmount(cost, locale) })
              : null}{" "}
            {t("ooc.description", {
              signedIn: pricing.freeCreditsSignedIn,
              max: pricing.freeCreditsMax,
            })}
          </P>
        </Div>
      </Div>
      <Div className="flex flex-col gap-2 sm:ml-11 sm:flex-row sm:items-center sm:gap-4">
        <Link
          href={authPageHref(locale, "signup", back)}
          className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
        >
          <Gift className="size-4" />
          {t("ooc.signUp")}
        </Link>
        <Link
          href={createHref(locale, kind)}
          className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
        >
          {t("ooc.defaults")}
        </Link>
        <P className="m-0 text-center text-xs text-muted-foreground sm:text-left">
          {t("ooc.haveAccount")}{" "}
          <Link
            href={authPageHref(locale, "login", back)}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {t("ooc.logIn")}
          </Link>
        </P>
      </Div>
    </Div>
  );
}

const SUBMIT = {
  image: "submitImage",
  video: "submitVideo",
  music: "submitMusic",
  speech: "submitSpeech",
  transcribe: "submitTranscribe",
} as const;

function RunningTime(): JSX.Element {
  const locale = useWidgetLocale();
  const { t } = scopedTranslation.scopedT(locale);
  const [start] = useState(Date.now);
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setSeconds(Math.floor((Date.now() - start) / 1000)),
      1000,
    );
    return (): void => clearInterval(timer);
  }, [start]);
  return <Span>{t("creating", { seconds })}</Span>;
}

export function StudioForm({
  kind,
  models,
  model,
  onModel,
  cost,
  ready,
  children,
  result,
}: {
  kind: CreateKind;
  models: StudioModel[];
  model?: StudioModel;
  onModel: (id: string) => void;
  cost: number | undefined;
  ready: boolean;
  children: ReactNode;
  result: ReactNode;
}): JSX.Element {
  const locale = useWidgetLocale();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const submitting = useWidgetIsSubmitting();
  const response = useWidgetResponse();
  const isAsync = kind === "video" || kind === "music";
  useEffect(() => {
    if (!submitting || !isAsync) {
      return;
    }
    // Pick up the newly created job. The history polls while it is active.
    const timer = setTimeout(() => {
      refreshStudioHistory(logger, kind);
    }, 1500);
    return (): void => clearTimeout(timer);
  }, [submitting, isAsync, kind, logger]);
  const outOfCredits =
    response?.success === false &&
    response.errorType.errorCode ===
      ErrorResponseTypes.PAYMENT_REQUIRED.errorCode;
  // A guest refused for this cost cannot run it again; any cheaper setup can.
  // Recorded per refusal while rendering (no effect), compared on later edits.
  const [refusal, setRefusal] = useState<{
    response: typeof response;
    cost: number | undefined;
  } | null>(null);
  if (outOfCredits && user.isPublic && refusal?.response !== response) {
    setRefusal({ response, cost });
  }
  const refusedCost =
    outOfCredits && refusal?.response === response ? refusal.cost : undefined;
  const blocked =
    user.isPublic &&
    cost !== undefined &&
    refusedCost !== undefined &&
    cost >= refusedCost;
  const { t } = scopedTranslation.scopedT(locale);
  const submit = useWidgetOnSubmit();
  const consent = useUncensoredConsent(user, logger);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const needsConsent =
    isUncensoredContent(model?.content) && consent.consented !== true;
  const Icon = STUDIO_ICONS[kind];
  const disabled = !!submitting || !ready || !model || blocked;
  return (
    <Div className="flex min-w-0 flex-col gap-5 p-4 sm:gap-6 sm:p-6">
      <StudioSelect
        label={t(kind === "speech" ? "voice" : "model")}
        value={model?.id}
        onChange={onModel}
        options={models.map((item) => ({
          value: item.id,
          label: item.name,
          price: t(`units.${item.isTokenPriced ? "tokenImage" : kind}`, {
            amount: formatCreditAmount(item.rate, locale),
          }),
        }))}
      />
      {children}
      {outOfCredits &&
      user.isPublic &&
      !creditPolicyReason(response.errorType.errorKey) ? (
        <GuestCredits kind={kind} cost={cost} />
      ) : outOfCredits ? (
        <OutOfCreditsCard
          locale={locale}
          isGuest={user.isPublic}
          reason={creditPolicyReason(response.errorType.errorKey)}
          className="max-w-none"
        />
      ) : (
        <FormAlertWidget field={{}} />
      )}
      <Div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Div className="flex items-baseline justify-between gap-2 sm:flex-col sm:items-start sm:gap-1">
          <Span className="text-xs text-muted-foreground">{t("estimate")}</Span>
          <Span className="text-sm font-semibold tabular-nums">
            {cost !== undefined
              ? t("credits", { amount: formatCreditAmount(cost, locale) })
              : kind === "speech" && model
                ? t("units.speech", {
                    amount: formatCreditAmount(model.rate, locale),
                  })
                : t("estimatePending")}
            {cost !== undefined && formatCreditsAsMoney(cost, locale) && (
              <Span className="ml-1.5 text-xs font-normal text-muted-foreground">
                {formatCreditsAsMoney(cost, locale)}
              </Span>
            )}
            {kind === "speech" && model && cost !== undefined && (
              <Span className="ml-1.5 text-xs font-normal text-muted-foreground">
                {t("units.speech", {
                  amount: formatCreditAmount(model.rate, locale),
                })}
              </Span>
            )}
          </Span>
        </Div>
        <Button
          type={needsConsent ? "button" : "submit"}
          data-testid="endpoint-submit"
          disabled={disabled}
          onClick={needsConsent ? () => setOpen(true) : undefined}
          variant={outOfCredits ? "outline" : "default"}
          className="min-h-11 gap-2 rounded-lg px-5"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <RunningTime />
            </>
          ) : (
            <>
              <Icon className="size-4" />
              {blocked && cost !== undefined
                ? t("needsCredits", {
                    amount: formatCreditAmount(cost, locale),
                  })
                : t(SUBMIT[kind])}
            </>
          )}
        </Button>
      </Div>
      {submitting && isAsync && (
        <Div
          aria-live="polite"
          className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-sm"
        >
          <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin text-muted-foreground" />
          <Span className="leading-relaxed text-muted-foreground">
            {t("asyncProgress")}
          </Span>
        </Div>
      )}
      {(kind === "transcribe" || model?.isTokenPriced) && (
        <Span className="text-xs leading-relaxed text-muted-foreground">
          {t("meteredCost")}
        </Span>
      )}
      {result}
      <UncensoredConsentDialog
        open={open}
        locale={locale}
        modelName={model?.name ?? null}
        error={error}
        isSaving={consent.isSaving}
        onDismiss={() => setOpen(false)}
        onPickAnother={() => setOpen(false)}
        onAgree={async () => {
          const res = await consent.agree();
          if (res.success) {
            setOpen(false);
            setError(null);
            submit?.();
          } else {
            setError(res.message);
          }
        }}
      />
    </Div>
  );
}
