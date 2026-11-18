"use client";

import { isUncensoredContent } from "next-vibe/agent/models/uncensored-consent/constants";
import { useUncensoredConsent } from "next-vibe/agent/models/uncensored-consent/hooks";
import { UncensoredConsentDialog } from "next-vibe/agent/models/uncensored-consent/widget/consent-dialog";
import { Button } from "next-vibe/ui/components/button";
import { Div } from "next-vibe/ui/components/div";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { Label } from "next-vibe/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "next-vibe/ui/components/select";
import { Span } from "next-vibe/ui/components/span";
import { useRouter } from "next-vibe/ui/hooks/use-navigation";
import {
  useWidgetIsSubmitting,
  useWidgetLocale,
  useWidgetLogger,
  useWidgetOnSubmit,
  useWidgetUser,
} from "next-vibe/unified-ui/_shared/use-widget-context";
import { FormAlertWidget } from "next-vibe/unified-ui/widgets/interactive/form-alert/widget";
import { type JSX, type ReactNode, useEffect, useId, useState } from "react";

import { formatCreditAmount } from "@/products/credit-money";

import { scopedTranslation } from "../i18n";
import type { CreateKind } from "./create-kinds";
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
  const router = useRouter();
  const user = useWidgetUser();
  const logger = useWidgetLogger();
  const submitting = useWidgetIsSubmitting();
  useEffect(() => {
    if (!submitting || (kind !== "video" && kind !== "music")) {
      return;
    }
    // Pick up the newly created job. The gallery polls while it is active.
    const timer = setTimeout(() => {
      void router.refresh();
    }, 1000);
    return (): void => clearTimeout(timer);
  }, [submitting, kind, router]);
  const { t } = scopedTranslation.scopedT(locale);
  const submit = useWidgetOnSubmit();
  const consent = useUncensoredConsent(user, logger);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const needsConsent =
    isUncensoredContent(model?.content) && consent.consented !== true;
  const Icon = STUDIO_ICONS[kind];
  const disabled = !!submitting || !ready || !model;
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
      <FormAlertWidget field={{}} />
      <Div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
        <Div className="flex items-baseline justify-between gap-2 sm:flex-col sm:items-start sm:gap-1">
          <Span className="text-xs text-muted-foreground">{t("estimate")}</Span>
          <Span className="text-sm font-semibold tabular-nums">
            {cost !== undefined
              ? t("credits", { amount: formatCreditAmount(cost, locale) })
              : t("estimatePending")}
          </Span>
        </Div>
        <Button
          type={needsConsent ? "button" : "submit"}
          data-testid="endpoint-submit"
          disabled={disabled}
          onClick={needsConsent ? () => setOpen(true) : undefined}
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
              {t(SUBMIT[kind])}
            </>
          )}
        </Button>
      </Div>
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
