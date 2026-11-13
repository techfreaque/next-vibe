"use client";

/**
 * The one-time 18+ / unfiltered-output dialog. Two ways out: agree, or pick
 * another model. Presentational: the caller owns open state and the actions.
 */

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { Button } from "next-vibe/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "next-vibe/ui/components/dialog";
import { Div } from "next-vibe/ui/components/div";
import { Loader2 } from "next-vibe/ui/components/icons/Loader2";
import { ShieldOff } from "next-vibe/ui/components/icons/ShieldOff";
import { Span } from "next-vibe/ui/components/span";
import { P } from "next-vibe/ui/components/typography";
import type { JSX } from "react";

import { scopedTranslation } from "../i18n";
import { UncensoredConsentTerms } from "./consent-terms";

export interface UncensoredConsentDialogProps {
  open: boolean;
  locale: CountryLanguage;
  /** Display name of the model that triggered the dialog, if any */
  modelName: string | null;
  isSaving: boolean;
  error: string | null;
  onAgree: () => void;
  onPickAnother: () => void;
  /** Escape / backdrop / close button */
  onDismiss: () => void;
}

export function UncensoredConsentDialog({
  open,
  locale,
  modelName,
  isSaving,
  error,
  onAgree,
  onPickAnother,
  onDismiss,
}: UncensoredConsentDialogProps): JSX.Element {
  const { t } = scopedTranslation.scopedT(locale);
  return (
    <Dialog
      open={open}
      onOpenChange={(next): void => {
        if (!next && !isSaving) {
          onDismiss();
        }
      }}
    >
      <DialogContent
        overlayClassName="z-[600]"
        className="z-[600] max-h-[92dvh] w-[calc(100vw-1.5rem)] max-w-md gap-0 overflow-y-auto rounded-2xl p-0 sm:rounded-2xl"
      >
        <Div
          className="@container flex flex-col gap-4 p-5 sm:p-6"
          data-testid="uncensored-consent-dialog"
        >
          <Div className="flex items-center gap-2 pr-8">
            <Span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
              <ShieldOff className="h-4 w-4" />
            </Span>
            <Span className="text-xs font-semibold uppercase tracking-wider text-warning">
              {t("dialog.eyebrow")}
            </Span>
          </Div>

          <Div className="flex flex-col gap-1.5">
            <DialogTitle className="text-xl font-bold leading-tight tracking-tight sm:text-2xl">
              {t("dialog.title")}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {t("dialog.stance")}
            </DialogDescription>
            {modelName ? (
              <Span className="text-sm font-medium text-foreground">
                {t("dialog.modelLine", { model: modelName })}
              </Span>
            ) : null}
          </Div>

          <UncensoredConsentTerms locale={locale} showStance={false} />

          {error ? (
            <P className="m-0 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </P>
          ) : null}

          <Div className="flex flex-col gap-2 sm:flex-row-reverse">
            <Button
              type="button"
              className="h-11 w-full font-semibold sm:flex-1"
              disabled={isSaving}
              onClick={onAgree}
              data-testid="uncensored-consent-agree"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("dialog.agreeing")}
                </>
              ) : (
                t("dialog.agree")
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full sm:flex-1"
              disabled={isSaving}
              onClick={onPickAnother}
              data-testid="uncensored-consent-pick-another"
            >
              {t("dialog.pickAnother")}
            </Button>
          </Div>

          <Span className="text-center text-xs text-muted-foreground">
            {t("dialog.footnote")}
          </Span>
        </Div>
      </DialogContent>
    </Dialog>
  );
}
